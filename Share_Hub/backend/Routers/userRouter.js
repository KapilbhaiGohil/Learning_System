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
const userRouter = express.Router();
const authDomain = config.authDomain;
userRouter.use(express.json())
userRouter.post('/getUser',getUser,async(req,res)=>{
    let {activeUser} = req.body;
    try{
        activeUser.profilePic = await getDownloadUrlPath(activeUser._id+'/profilePic.png');
        return res.status(200).json(activeUser);
    }catch (e) {
        console.log(e);
        if(e.code==='storage/object-not-found'){
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
export {userRouter};