const cookieParser = require('cookie-parser');
const express = require('express')
const userRouter = express.Router();
userRouter.use(express.json())
userRouter.use(cookieParser())
const User = require('../Models/User')
const jsonwebtoken = require('jsonwebtoken')

userRouter.post('/getUserByCookie',async(req,res)=>{
    const {token} = req.body
    if(!token){
        return res.status(401).send({ msg: "Unauthorized request - Missing Token" });
    }
    try{
        const obj = await jsonwebtoken.verify(token,process.env.JSONKEY)
        const user = await User.findOne({_id:obj._id})
        return res.status(200).json(user);
    }catch (e) {
        console.error(e)
        return res.status(401).send({msg:"Unauthorized request - Invalid Token"})
    }
})
module.exports = userRouter;