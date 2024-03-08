import express from "express";
import {mongoose} from "../Database/conn.js";
import User from "../Models/User.js"
import {Material,Comment} from "../Models/Material.js";
import {getUser, GetUserFromAuthReq, upload,} from "../middleware/midllewares.js";
import {
    createFolder,
    deleteFile, deleteFolder, getDownloadUrlPathUsingManulMaking, getFilesFromFolder,
    listFilesAndDirs,
    uploadFile,
} from "../Utils/fileFunctions.js";
import fs from "fs";
import bodyParser from 'body-parser';
import otpGenerator from "otp-generator";
import AdmZip from 'adm-zip'
import Path from 'path'
import {NotificationCollection} from "../Models/Material.js";
import {CheckForAccess} from "./functions.js";
import {populate} from "dotenv";
const MaterialRouter = express.Router()
MaterialRouter.use(express.json())
MaterialRouter.use(bodyParser.json())

MaterialRouter.post('/create',getUser,async(req,res)=>{
    const session = await mongoose.startSession();
    await session.startTransaction();
    try{
        const {activeUser,name,desc} = req.body;
        let user = await User.findById(activeUser._id);
        if(!user){
            user = await new User({_id:activeUser._id,email:activeUser.email,name:activeUser.name})
            await user.save();
        }
        let  code = otpGenerator.generate(8, { digits: false, upperCaseAlphabets: false,specialChars: false});
        while(await Material.findOne({code})){
            code = otpGenerator.generate(8, { digits: false, upperCaseAlphabets: false,specialChars: false});
        }
        let material = await new Material({name,desc,code,user:[activeUser._id],creator:activeUser._id});
        await material.save();
        const result = await createFolder(`${user._id}/${material._id}`);
        user.materials.push({material:material._id,role:'Owner'});
        await user.save();
        const fullUser = await User.findById(user._id).populate('materials.material').lean();
        const materialsWithAccess = await Promise.all(fullUser.materials.map(async (obj)=>{
            const info = await CheckForAccess(obj.material,activeUser);
            obj.rights = info.access;
            return obj;
        }))
        await session.commitTransaction();
        return res.status(200).json(materialsWithAccess);
    }catch (e) {
        await session.abortTransaction();
        console.log(e);
        return res.status(500).send({msg:e.message})
    }finally{
        await session.endSession();
    }
})
MaterialRouter.post('/like',getUser,async(req,res)=>{
    try{
          const {materialId,activeUser} = req.body;
          const material = await Material.findById(materialId);
          if(!material)return res.status(400).send({msg:"No material found with this id."});
          if(material.likes.find((u)=>u.toString()===activeUser._id.toString())){
              return res.status(200).send({msg:"Aleready liked the material."});
          }
          await material.likes.push(activeUser._id);
          await material.save();
          return res.status(200).json(material)
    }catch (e) {
        console.log(e);
        return res.status(500).send({msg:"Internal server error."})
    }
})
MaterialRouter.post('/removeLike',getUser,async(req,res)=>{
    try{
        const {materialId,activeUser} = req.body;
        const material = await Material.findById(materialId);
        if(!material)return res.status(400).send({msg:"No material found with this id."});
        const likes = material.likes;
        for (let i = 0; i < likes.length; i++) {
            if(likes[i].toString()===activeUser._id.toString()){
                likes.splice(i,1);
                break;
            }
        }
        material.likes = likes;
        await material.save();
        return res.status(200).json(material)
    }catch (e) {
        console.log(e);
        return res.status(500).send({msg:"Internal server error."})
    }
})
MaterialRouter.post('/addMaterial',getUser,async(req,res)=>{
    const session = await mongoose.startSession();
    await session.startTransaction();
    try{
        const {activeUser,materialCode,role='Viewer'} = req.body;
        let user = await User.findById(activeUser._id);
        if(!user){
            user = await new User({_id:activeUser._id,email:activeUser.email,name:activeUser.name})
            await user.save();
        }
        let material = await Material.findOne({code:materialCode});
        if(!material)return res.status(400).send({msg:`No material found with the code ${materialCode}.`,field:'code'})
        let alreadyHas = await User.find({_id:user._id,'materials.material.code': materialCode});
        if(alreadyHas.length>0)return res.status(409).send({msg:"Material is already in your list.",field:'code'})
        user.materials.push({material:material._id,role});
        material.users.push(user._id);
        await user.save();
        await material.save();
        const fullUser = await User.findById(activeUser._id).populate('materials.material').lean();
        const materialsWithAccess = await Promise.all(fullUser.materials.map(async (obj)=>{
            const info = await CheckForAccess(obj.material,activeUser);
            obj.rights = info.access;
            return obj;
        }));
        await session.commitTransaction();
        return res.status(200).json(materialsWithAccess);
    }catch (e) {
        await session.abortTransaction();
        console.log(e);
        return res.status(500).send({msg:e.toString(),field:'code'})
    }finally{
        await session.endSession();
    }
})

MaterialRouter.post('/get',getUser,async(req,res)=>{
    try{
        const {activeUser} = req.body;
        const user = await User.findById(activeUser._id).populate('materials.material').lean();
        if(!user || user.materials.length===0)return res.status(200).send({msg:"No material found for this user."});
        const materialsWithAccess = await Promise.all(user.materials.map(async (obj)=>{
            const info = await CheckForAccess(obj.material,activeUser);
            obj.rights = info.access;
            return obj;
        }))
        return res.status(200).json(materialsWithAccess);
    }catch (e){
        console.log(e);
        return res.status(500).send({msg:"Internal server error"})
    }
})


MaterialRouter.post('/getMaterialById',getUser,async(req,res)=>{
    try{
        const {activeUser,materialId} = req.body;
        const user = await User.findOne({
            _id:activeUser._id,
            'materials.material': materialId
        });
        if(!user)return res.status(400).send({msg:"This material does not belongs to you try with another one"});
        const material = await Material.findOne({_id:materialId}).lean();
        const info = await CheckForAccess(material,activeUser);
        material.rights = info.access;
        return res.status(200).json(material);
    }catch (e){
        console.log(e);
        return res.status(500).send({msg:e.toString()})
    }
})

MaterialRouter.post('/upload',upload.single('inputFile'),getUser,async(req,res)=>{
    try{
        const {activeUser,initialPath,manualPath,materialId} = req.body;
        const material = await Material.findById(materialId);
        if(!material)return res.status(400).send({msg:"provide the proper material."})
        const info = await CheckForAccess(material,activeUser,'upload');
        if(!info.ok)return res.status(403).send({msg:"You don't have right to create folder."});
        let cloudPath = material.creator._id+'/'+initialPath+'/';
        if(manualPath)cloudPath+=manualPath+'/';
        await uploadFile(req.file,cloudPath);
        // await new Promise(resolve => setTimeout(resolve, 15000));
        return res.status(200).send({msg:"file uploaded successfully"});
    }catch (e) {
        console.log(e);
        return res.status(500).send({msg:"Internal server error."})
    }finally {
        fs.unlink(req.file.path,(err)=>{
            if(err)console.log(err);
        });
    }
})

MaterialRouter.post('/createFolder',getUser,async(req,res)=>{
    try{
        let{activeUser,folderName,path,material} = req.body;
        if(!material || !folderName)return res.status(400).send({msg:"All field are mandatory"});
        material = await Material.findById(material._id);
        if(!material)return res.status(400).send({msg:"Invalid data given to the server."})
        const info = await CheckForAccess(material,activeUser,'upload');
        if(!info.ok)return res.status(403).send({msg:"You don't have right to create folder."});
        const cloudPath = `${material.creator._id}/${material._id}/${path}/${folderName}`;
        const result = await createFolder(cloudPath);
        if(result.ok)return res.status(200).send({msg:"Folder created successfully."});
        return res.status(401).json(result);
    }catch (e){
        console.log(e);
        return res.status(500).send({msg:e.message});
    }
})
MaterialRouter.post('/download',getUser,async(req,res)=>{
    try{
        const {activeUser,path,files,folders,materialId} = req.body;
        const material = await Material.findById(materialId);
        if(!material)return res.status(400).send({msg:"Pls provide the correct material id"});

        let check = material.users.filter((u)=>u._id.toString()===activeUser._id.toString());
        if(!material.creator._id.toString()===activeUser._id.toString() && check.length !== 1 )return res.status(400).send({msg:"You don't have access to the material"});

        const info = await CheckForAccess(material,activeUser,'download');
        if(!info.ok)return res.status(403).send({msg:"You don't have right to donwload files."});
        let initialPath = `${material.creator._id}/${material._id}/${path}`;
        let finalFiles = [];
        for (let i = 0; i < files.length; i++) {
            finalFiles.push({path:initialPath,name:files[i].storedName,downloadUrl:files[i].url})
        }
        for (let i = 0; i < folders.length; i++) {
            finalFiles = finalFiles.concat(...(await getFilesFromFolder(initialPath+folders[i].name)));
        }
        //finalFiles for zipping
        // console.log(finalFiles)
        const zip = new AdmZip();
        for(const file of finalFiles){
            const ext = Path.extname(file.name);
            const fileName = file.name.slice(0,-24-ext.length)+ext;
            const relativePath = file.path.substr(initialPath.length+1,file.path.length);
            const fileData = await fetch(file.downloadUrl).then(res=>res.arrayBuffer());
            if (!zip.getEntry(relativePath + fileName)) {
                zip.addFile(relativePath + fileName, Buffer.from(fileData));
            } else {
                zip.addFile(relativePath+file.name,Buffer.from(fileData));
            }
        }
        const zipBuffer = zip.toBuffer();
        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename="UnknownStudyFiles.zip"',
        });
        return res.status(200).send(zipBuffer);
    }catch (e) {
        console.log(e);
        return res.status(500).send({msg:e.message,e})
    }
})
MaterialRouter.post('/deleteFile',getUser,async(req,res)=>{
    try{
        const {activeUser,materialId,path,type='file',fileName} = req.body;
        const user = await User.findById(activeUser._id);
        const material = await Material.findById(materialId);
        if(!material)return res.status(400).send({msg:"You have provided the wrong material id."});

        const info = await CheckForAccess(material,activeUser,'delete');
        if(!info.ok)return res.status(403).send({msg:"You don't have right to delete files."});

        const cloudPath = `${material.creator._id}/${material._id}/${path}`
        if(type==='folder'){
            const failed = await deleteFolder(cloudPath+`/${fileName}`);
            if(failed.length===0){
                return res.status(200).send({msg:"Successfully deleted all files within the folder"})
            }else{
                return res.status(500).json(failed);
            }
        }else{
            const result = await deleteFile(cloudPath,fileName);
            if(result.ok){
                return res.status(200).send({msg:"Successfully deleted the files"})
            }else{
                console.log(result.error);
                return res.status(500).json(result.error);
            }
        }
    }catch (e) {
        console.log(e);
        return res.status(500).send({msg:"Internal server error."})
    }
})

MaterialRouter.post('/getFilesList',getUser,async(req,res)=>{
    try{
        const {activeUser,path,materialId} = req.body;
        const material = await Material.findById(materialId);
        let check = material.users.filter((u)=>u._id.toString()===activeUser._id.toString());
        if(!material.creator._id.toString()===activeUser._id.toString() && check.length !==1 )return res.status(400).send({msg:"You don't have access to the material"});
        let cloudPath = material.creator.toString()+"/"+path+"/";
        const {files,folders} = await listFilesAndDirs(cloudPath);
        let normalPath = path.slice(25,path.length);
        return res.status(200).json({files,prefix:normalPath,folders});
    }catch (e) {
        console.log(e);
        return res.status(500).send({msg:e.toString()})
    }
})
MaterialRouter.post('/deleteMaterial',getUser,async(req,res)=>{
    try{
        const {activeUser,materialId} = req.body;
        if(!materialId)return res.status(400).send({msg:"All fields are mandatory"})
        const material = await Material.findById(materialId)
        if(!material)return res.status(400).send({msg:"Invalid field values provided"});
        if(material.creator.toString()!==activeUser._id.toString())return res.status(400).send({msg:"You don't have access to delete material"})
        const cloudPath =  `${activeUser._id}/${material._id}`
        const failed = await deleteFolder(cloudPath);
        if(failed.length===0){
            const creator = await User.findById(activeUser._id);
            let users = [...material.users,creator];
            for (let i = 0; i < users.length; i++) {
                const user = await User.findById(users[i]._id);
                user.materials = user.materials.filter(m=>m.material._id.toString()!==material._id.toString());
                await user.save();
            }
            await NotificationCollection.deleteMany({category:'Invitation','fields.material':material._id})
            await Material.findByIdAndDelete(material._id);
            const fullUser = await User.findById(activeUser._id).populate('materials.material').lean();
            const materialsWithAccess = await Promise.all(fullUser.materials.map(async (obj)=>{
                const info = await CheckForAccess(obj.material,activeUser);
                obj.rights = info.access;
                return obj;
            }))
            return res.status(200).json(materialsWithAccess);
        }else{
            return res.status(500).json(failed);
        }
    }catch (e) {
        console.log(e);
        return res.status(500).send({msg:e.message,e})
    }
})
MaterialRouter.post('/addComment',getUser,async(req,res)=>{
    try{
        const {materialId,activeUser,msg}=req.body;
        const material = await Material.findById(materialId);
        if(!material)return res.status(401).send({msg:"Invalid comment request for non existant material ."});
        let check = material.users.filter((u)=>u._id.toString()===activeUser._id.toString());
        if(!material.creator._id.toString()===activeUser._id.toString() && check.length !== 1)return res.status(400).send({msg:"You don't have access to the material"});
        const newComment = await new Comment({comment:msg,by:activeUser._id});
        await newComment.save();
        material.comments.push(newComment._id);
        await material.save();
        return res.status(200).json(material);
    }catch (e){
        console.log(e);
        if(e.kind === 'ObjectId'){
            return res.status(400).send({msg:e.message});
        }
        return res.status(500).send({msg:e.message});
    }
})
MaterialRouter.post('/getComments',getUser,async(req,res)=>{
    try{
        const{materialId,activeUser} = req.body;
        const material = await Material.findById(materialId);
        if(!material)return res.status(400).send({msg:"Invalid material id."})
        let check = material.users.filter((u)=>u._id.toString()===activeUser._id.toString());
        if(!material.creator._id.toString()===activeUser._id.toString() && check.length !== 1)return res.status(400).send({msg:"You don't have access to the material"});
        const cids = material.comments;
        let comments = await Comment.find({_id:{$in:cids}}).populate('by').lean();
        for (let i = 0; i < comments.length; i++) {
            comments[i].profilePic = getDownloadUrlPathUsingManulMaking(`${comments[i].by._id}/profilePic.png`,'media');
        }
        return res.status(200).json(comments);
    }catch (e){
        console.log(e);
        return res.status(500).send({msg:e.message});
    }
})
MaterialRouter.post('/sendInvitation',getUser,async(req,res)=>{
    try{
        const {activeUser,peoples,materialId,token} = req.body;
        if(!peoples || !materialId)return res.status(400).send({msg:"User selection required to which you are sharing material."})
        const material = await Material.findById(materialId);
        if(!material)return res.status(400).send({msg:"invalid request for seding the invitation."});
        if(activeUser._id.toString() !== material.creator.toString()){
            return res.status(403).send({msg:"Only owner of the material can send invitation for joining material."})
        }
        const newNotifications = peoples.map(async(p)=>{
            let exist = await User.findById(p._id);
            if(!exist){
                const userFromAuth = await GetUserFromAuthReq(token);
                if(userFromAuth!==null){
                    let user = await new User({_id:userFromAuth._id,email:userFromAuth.email,name:userFromAuth.name})
                    await user.save();
                    exist = user;
                }
            }
            if(!exist)return res.status(400).send({msg:"Invalid data for the person"});
            let pending = await NotificationCollection.findOneAndUpdate(
                { by: activeUser._id, to: exist._id, category: 'Invitation','fields.material':material._id},
                { $set: { fields: {access: p.access ,material:material._id}}},
                { upsert: true, returnDocument: 'after' }
            );
        });
        return res.status(200).send({msg:`Invitation for joining material sended to ${peoples.length} users.`});
    }catch (e) {
        console.log(e);
        return res.status(500).send({msg:e.message,e})
    }
})
MaterialRouter.post('/getNotifications',getUser,async(req,res)=>{
    try{
        const {activeUser} = req.body;
        const notifications = await NotificationCollection.find({$or:[{to:activeUser._id},{toAll:true}]})
            .populate({path:'by',select:'name'}).populate({path:'to',select:'name'}).populate({path:'fields.material',select:'name',model:'Material'});
        return res.status(200).json(notifications);
    }catch (e) {
        console.log(e);
        return res.status(500).send({msg:e.message,e})
    }
})
MaterialRouter.post('/responseForInvitation',getUser,async(req,res)=>{
    try{
        const {activeUser,joined=false,notificationId} = req.body;
        const notification = await NotificationCollection.findById(notificationId).populate({path:'fields.material',select:'code'});
        if(!notification)return res.status(400).send({msg:"Something wrong happend with the request."})
        if(activeUser._id.toString()!==notification.to.toString())return res.status(400).send({msg:"Receiver has share the material to someone else"});
        if(joined){
            let material = await Material.findById(notification.fields.material._id);
            let user = await User.findById(activeUser._id);
            if(!material)return res.status(400).send({msg:`No material found`})
            let alreadyHas = await User.find({_id:user._id,'materials.material._id': material._id});
            if(alreadyHas.length>0)return res.status(409).send({msg:"Material is already in your list."})
            user.materials.push({material:material._id,role:notification.fields.access});
            material.users.push(user._id);
            await user.save();
            await material.save();
        }
        await NotificationCollection.findByIdAndDelete(notificationId);
        return res.status(200).send({msg:"Successfull"});
    }catch (e) {
        console.log(e);
        return res.status(500).send({msg:e.message,e})
    }
})
MaterialRouter.post('/leaveMaterial',getUser,async(req,res)=>{
    try{
        const{activeUser,materialId} = req.body;
        const material = await Material.findById(materialId);
        if(material.creator.toString()===activeUser._id.toString())return res.status(400).send({msg:"You are owner of material.you can't leave."})
        const result = await Material.findByIdAndUpdate(material._id,{$pull:{users:activeUser._id}},{new:true});
        const result2 = await User.findByIdAndUpdate(activeUser._id,{$pull:{materials:{material:materialId}}},{new:true})
        if(!result || !result2){
            return res.status(400).send({msg:"Given material no more exist in you material list."});
        }else{
            return res.status(200).send({msg:"Successfully removed material from your list."});
        }
    }catch (e){
        console.log(e);
        return res.status(500).send({msg:e.message});
    }
})

MaterialRouter.post('/likeComment',getUser,async(req,res)=>{
    try{
        const{activeUser,commentId} = req.body;
        const comment = await Comment.findById(commentId);
        if(!comment)return res.status(400).send({msg:"Invalid comment id."});

    }catch (e){
        console.log(e);
        return res.status(500).send({msg:e.message});
    }
})
MaterialRouter.post('/dislikeComment',getUser,async(req,res)=>{
    try{

    }catch (e){
        console.log(e);
        return res.status(500).send({msg:e.message});
    }
});
export {MaterialRouter};


//basic format
// MaterialRouter.post('/create',getUser,async(req,res)=>{
//     try{
//           const {} = req.body;
//     }catch (e) {
//         console.log(e);
//         return res.status(500).send({msg:"Internal server error."})
//     }
// })