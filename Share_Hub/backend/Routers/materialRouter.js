import express from "express";
import {mongoose} from "../Database/conn.js";
import User from "../Models/User.js"
import {Material} from "../Models/Material.js";
const MaterialRouter = express.Router()
MaterialRouter.use(express.json())
import {getUser} from "../middleware/midllewares.js";
import multer from "multer";
import path from "path";
import {deleteFolder, uploadFile} from "../Utils/fileFunctions.js";
import fs from "fs";

const fileRouter = express.Router()
const storage = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,'./uploads');
    },
    filename:function (req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname+'-'+uniqueSuffix)
    }
})
const upload = multer({storage:storage});
MaterialRouter.post('/create',getUser,async(req,res)=>{
    const session = await mongoose.startSession();
    try{
        await session.startTransaction();
        const {activeUser,name,desc} = req.body;
        let user = await User.findById(activeUser._id);
        if(!user){
            user = await new User({_id:activeUser._id,email:activeUser.email})
            await user.save();
        }
        let material = await new Material({name,desc,creator:user._id});
        await material.save();
        user.materials.push(material._id);
        user.save();
        await session.commitTransaction();
        const materials = [];
        for (let i = 0; i < user.materials.length; i++) {
            materials.push(await Material.findById(user.materials[i].toString()));
        }
        return res.status(200).send({msg:"Successfully created new material.",materials});
    }catch (e) {
        await session.abortTransaction();
        console.log(e);
        return res.status(500).send({msg:"Internal server error."})
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
    try{
        await session.startTransaction();
        const {activeUser,materialId} = req.body;
        let user = await User.findById(activeUser._id);
        if(!user){
            user = await new User({_id:activeUser._id,email:activeUser.email})
            await user.save();
        }
        let material = await Material.findById(materialId);
        if(!material)return res.status(400).send({msg:"Pls enter the correct code for the material."})
        let alreadyHas = await User.find({_id:user._id,materials:material._id});
        console.log(alreadyHas);
        if(alreadyHas.length>0)return res.status(409).send({msg:"Material is already in your list."})
        user.materials.push(material._id);
        user.save();
        await session.commitTransaction();
        const materials = [];
        for (let i = 0; i < user.materials.length; i++) {
            materials.push(await Material.findById(user.materials[i].toString()));
        }
        return res.status(200).send({msg:"Successfully created new material.",materials});
    }catch (e) {
        await session.abortTransaction();
        console.log(e);
        return res.status(500).send({msg:e.toString()})
    }finally{
        await session.endSession();
    }
})

MaterialRouter.post('/get',getUser,async(req,res)=>{
    try{
        const {activeUser} = req.body;
        const user = await User.findById(activeUser._id);
        if(!user)return res.status(200).send({msg:"No material found for this user."});
        const materials = [];
        for (let i = 0; i < user.materials.length; i++) {
            materials.push(await Material.findById(user.materials[i].toString()));
        }
        return res.status(200).json(materials);
    }catch (e){
        console.log(e);
        return res.status(500).send({msg:"Internal server error"})
    }
})
export {MaterialRouter,fileRouter};


//basic format
// MaterialRouter.post('/create',getUser,async(req,res)=>{
//     try{
//           const {} = req.body;
//     }catch (e) {
//         console.log(e);
//         return res.status(500).send({msg:"Internal server error."})
//     }
// })