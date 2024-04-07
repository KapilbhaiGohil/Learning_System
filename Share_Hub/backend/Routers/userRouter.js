import express from 'express'
import {getUser} from "../middleware/midllewares.js";
import {
    generateAndUploadProfilePic,
    getDownloadUrlPath,
    getDownloadUrlPathUsingManulMaking
} from "../Utils/fileFunctions.js";
import {Material} from "../Models/Material.js";
import fetch from 'node-fetch';
import config from '../config.js'
import User from "../Models/User.js";
import {CheckForAccess} from "./functions.js";
const userRouter = express.Router();
const authDomain = config.authDomain;
userRouter.use(express.json())
userRouter.post('/getUser',getUser,async(req,res)=>{
    let {activeUser} = req.body;
    try{
        activeUser.profilePic = await getDownloadUrlPathUsingManulMaking(activeUser._id+'/profilePic.png');
        return res.status(200).json(activeUser);
    }catch (e) {
        console.log(e);
        if(e.code==='storage/object-not-found'){
            console.log('reuploading image...')
            const info = await generateAndUploadProfilePic(activeUser);
            activeUser.profilePic = await getDownloadUrlPathUsingManulMaking(activeUser._id+'/profilePic.png');
            if(!info.status==='failed')return res.status(200).json(activeUser);
        }
        return res.status(500).send({msg:"Internal server error."})
    }
})

userRouter.post('/searchUser',getUser,async(req,res)=>{
    try{
        let { activeUser, searchEmail,materialId} = req.body;
        if(!searchEmail)return res.status(400).send({msg:"All fields are mandatory."})
        if(searchEmail.length<4)return res.status(200).json([]);
        const material = await Material.findById(materialId);
        if(!material)return res.status(400).send({msg:"Invalid request for sharing.please refresh page and try again."});
        const userIds = await material.users.map(u=>u.toString());
        userIds.push(material.creator.toString());
        const response = await fetch(authDomain+'/user/searchUserByEmailPrefix',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({searchEmail,userIds,activeUser})
        });
        if(response.ok){
            const users = await response.json();
            for(const u of users){
                u.profilePic = getDownloadUrlPathUsingManulMaking(`${u._id}/profilePic.png`,'media')
            }
            activeUser.profilePic = await getDownloadUrlPath(activeUser._id+'/profilePic.png');
            return res.status(200).json(users);
        }else{
            return res.status(500).send({msg:"failed to fetch data from teh auth server."})
        }
    }catch (e) {
        console.log(e);
        return res.status(500).send({msg:e.message,e});
    }
})
userRouter.post('/getRightsForUser',getUser,async(req,res)=>{
    try{
        const {activeUser,materialId} = req.body;
        const material = await Material.findById(materialId);
        if(!material)return res.status(400).send({msg:"No materail found with provided information."});
        const info = await CheckForAccess(material,activeUser);
        return res.status(200).json(info.access);
    }catch (e) {
        console.log(e);
        return res.status(500).send({msg:"Internal server error.",e})
    }
})
userRouter.post('/fetchOrSetAccess',getUser,async(req,res)=>{
    try{
        const{activeUser,set,accessInfo} = req.body;
        let user = await User.findById(activeUser._id);
        if(!user){
            user = await new User({_id:activeUser._id,email:activeUser.email,name:activeUser.name})
            await user.save();
        }
        if(set){
            const accessRights = ['share','upload','delete','download'];
            const levels = ['Editor','Collaborator','Viewer'];
            for (let i = 0; i < levels.length; i++) {
                for (let j = 0; j < accessRights.length; j++) {
                    if(accessInfo[levels[i]]){
                        user.accessInfo[levels[i]][accessRights[j]] = accessInfo[levels[i]][accessRights[j]];
                    }
                }
            }
            await user.save();
        }
        return res.status(200).json(user.accessInfo);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send({msg:'Internal server error.',e});
    }
})
export {userRouter};