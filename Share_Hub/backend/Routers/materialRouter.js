import express from "express";
import {mongoose} from "../Database/conn.js";
import User from "../Models/User.js"
import {Material,Comment} from "../Models/Material.js";
import {getUser, upload,} from "../middleware/midllewares.js";
import {
    createFolder,
    deleteFile, deleteFolder,
    listFilesAndDirs,
    uploadFile,
} from "../Utils/fileFunctions.js";
import fs from "fs";
import bodyParser from 'body-parser';
import {firebaseConfig} from "../Utils/firebaseConfig.js";
import otpGenerator from "otp-generator";
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
        const fullUser = await user.populate('materials.material');
        await session.commitTransaction();
        return res.status(200).json(fullUser.materials);
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
        await session.commitTransaction();
        const fullUser = await user.populate('materials.material')
        return res.status(200).json(fullUser.materials);
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
        const user = await User.findById(activeUser._id);
        if(!user || user.materials.length===0)return res.status(200).send({msg:"No material found for this user."});
        const fullUser = await user.populate('materials.material');
        return res.status(200).json(fullUser.materials);
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
        if(!user)return res.status(200).send({msg:"This material does not belongs to you try with another one"});
        const material = await Material.findOne({_id:materialId});
        return res.status(200).json(material);
    }catch (e){
        console.log(e);
        return res.status(500).send({msg:e.toString()})
    }
})

MaterialRouter.post('/upload',upload.single('inputFile'),getUser,async(req,res)=>{
    try{
        const {activeUser,initialPath,manualPath} = req.body;
        let cloudPath = activeUser._id+'/'+initialPath+'/';
        if(manualPath)cloudPath+=manualPath+'/';
        await uploadFile(req.file,cloudPath);
        // await new Promise(resolve => setTimeout(resolve, 1500));
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
        const{activeUser,folderName,path,material} = req.body;
        if(!material || !folderName)return res.status(400).send({msg:"All field are mandatory"});
        const cloudPath = `${activeUser._id}/${material._id}/${path}/${folderName}`
        const result = await createFolder(cloudPath);
        if(result.ok)return res.status(200).send({msg:"Folder created successfully."});
        return res.status(401).json(result);
    }catch (e){
        console.log(e);
        return res.status(500).send({msg:e.message});
    }
})

MaterialRouter.post('/deleteFile',getUser,async(req,res)=>{
    try{
        const {activeUser,materialId,path,type='file',fileName} = req.body;
        const user = await User.findById(activeUser._id);
        const material = await Material.findById(materialId);
        if(!material)return res.status(400).send({msg:"You have provided the wrong material id."});
        if(!user || user._id.toString()!==material.creator._id.toString())return res.status(400).send({msg:"You don't have right to delete other's material."})
        const cloudPath = `${user._id}/${material._id}/${path}`
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
          let cloudPath = material.creator.toString()+"/"+path+"/";
          const {files,folders} = await listFilesAndDirs(cloudPath);
          let normalPath = path.slice(25,path.length);
          return res.status(200).json({files,prefix:normalPath,folders});
    }catch (e) {
        console.log(e);
        return res.status(500).send({msg:e.toString()})
    }
})

MaterialRouter.post('/addComment',getUser,async(req,res)=>{
    try{
        const {materialId,activeUser,msg}=req.body;
        const material = await Material.findById(materialId);
        if(!material)return res.status(401).send({msg:"Invalid comment request for non existant material ."});
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
        const{materialId} = req.body;
        const material = await Material.findById(materialId);
        if(!material)return res.status(400).send({msg:"Invalid material id."})
        const cids = material.comments;
        let comments = await Comment.find({_id:{$in:cids}}).populate('by').lean();
        for (let i = 0; i < comments.length; i++) {
            const profilePicPath = encodeURIComponent(`${comments[i].by._id}/profilePic.png`);
            const profilePicUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${profilePicPath}?alt=media`;
            comments[i].profilePic = profilePicUrl;
        }
        return res.status(200).json(comments);
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
})
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