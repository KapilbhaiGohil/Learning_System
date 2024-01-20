import express from "express";
import fetch from "node-fetch";
import {mongoose} from "../Database/conn.js";
import User from "../Models/User.js"
import {Material} from "../Models/Material.js";
import {createFolder, deleteFile} from "../Utils/cloudFunctions.js";
const MaterialRouter = express.Router()
MaterialRouter.use(express.json())
import config from "../config.js";
const authDomain = config.authDomain

MaterialRouter.post('/create',async(req,res)=>{
    try{
        const token = req.cookies.token;
        const {name,desc} =req.body;
        const authRes = await fetch(authDomain+'/user/getUserByCookie',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({token})
        });
        if(authRes.ok){
            const user = await authRes.json();
            const session = await mongoose.startSession();
            try{
                session.startTransaction();
                const userExist = await User.findOne({email:user.email});
                if(userExist){
                    if(!userExist.driveFolderId){
                        const folderId = await createFolder(userExist._id,config.rootFolderId);
                        if(folderId===null){
                            return res.status(500).send({msg:"Unable to create material due to cloud server error.Pls inform admin of site"})
                        }else{
                            userExist.driveFolderId = folderId;
                        }
                    }
                    const materialFolder = await createFolder(name,userExist.driveFolderId);
                    const newMaterial = await new Material({creator:userExist._id,name,desc,driveFolderId:materialFolder});
                    await newMaterial.save();
                    userExist.material.push(newMaterial._id);
                    await userExist.save();
                }else{
                    const newUser =await new User({email:user.email});
                    await newUser.save();
                    const folderId= await createFolder(newUser._id,config.rootFolderId);
                    if(folderId===null)return res.status(500).send({msg:"Unable to create material due to cloud server error.Pls inform admin of site"})
                    newUser.driveFolderId = folderId;
                    const materialFolder = await createFolder(name,newUser.driveFolderId);
                    await newUser.save();
                    const newMaterial = await new Material({creator:newUser._id,name,desc,driveFolderId:materialFolder});
                    await newMaterial.save();
                    newUser.material.push(newMaterial._id);
                    await newUser.save();
                }
                await session.commitTransaction();
            }catch (e){
                console.log(e)
                await session.abortTransaction();
                return res.status(500).send({msg:"Database Server error"})
            }finally {
                await session.endSession();
            }
            return res.status(200).send({msg:"Material created successfully "});
        }else{
            const data = await authRes.json();
            return res.status(401).send({msg:data.msg})
        }
    }catch(e){
        console.log(e)
        return res.status(500).send({msg:"Internal server error"})
    }
})
MaterialRouter.post('/delete',async(req,res)=>{
    try{
        const {id,type} = req.body;
        if(type==='file'){
            const bool = await deleteFile(id);
            if(bool)return res.status(200).send({msg:"Successfully deleted file"})
        }else if(type==='material'){

        }
    }catch (e) {
        console.log(e);
    }
    return res.status(500).send({msg:"Error which deleting file"})
});
export {MaterialRouter};