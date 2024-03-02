import express from 'express'
import cookieParser from "cookie-parser";
import {User} from '../Models/User.js'
import jsonwebtoken from "jsonwebtoken";
const userRouter = express.Router();
userRouter.use(express.json())
userRouter.use(cookieParser())

userRouter.post('/getUserByCookie',async(req,res)=>{
    const {token} = req.body
    if(!token){
        return res.status(401).send({ msg: "Unauthorized request - Missing Token",field:'token'});
    }
    try{
        const obj = await jsonwebtoken.verify(token,process.env.JSONKEY)
        const user = await User.findOne({_id:obj._id})
        if(user){
            return res.status(200).json(user);
        }else{
            return res.status(401).send({msg:"No user found with the token."})
        }
    }catch (e) {
        console.error(e)
        return res.status(401).send({msg:"Unauthorized request - Invalid Token"})
    }
})
userRouter.post('/searchUserByEmailPrefix',async(req,res)=>{
    try{
        console.log('helo world')
        let {activeUser,searchEmail,userIds} = req.body;
        if(!activeUser)return res.status(400).send({msg:"This endpoint is not open for all request."});
        const users = await User.find({ email: { $regex: new RegExp(`^${searchEmail}`, 'i') },_id:{$nin:userIds} })
            .limit(4).lean();
        return res.status(200).json(users);
    }catch (e) {
        console.log(e);
        return res.status(500).send({msg:"Internal server error."})
    }
})

export {userRouter};