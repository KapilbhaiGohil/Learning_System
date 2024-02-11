const express = require('express')
const authRouter = express.Router();
const User = require('../Models/User')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const authenticate = require('../Middlewares/authenticate')
const [Otp,generateAndSendOtp] = require('../Models/Otp');
authRouter.use(express.json())


authRouter.post('/signUp',async(req,res)=>{
    try{
        const {name,email,password,otp}=req.body;
        if(!name ||!email||!password)return res.status(400).send({msg:"All Fields are mandatory"})
        if(otp){
            const u = await Otp.findOne({email});
            if(!u){
                return res.status(403).send({msg:"Otp expired. please generate new otp"});
            }else{
                if(u.otp !== otp){
                    return res.status(403).send({msg:"Otp verification failed. please enter correct otp"});
                }else{
                    await Otp.deleteOne({email});
                    const newUser =  await new User({name,email,password});
                    const isCreated = await newUser.save();
                    if (isCreated) {
                        return res.status(200).send({ msg: "Successfully Saved User" });
                    }
                    return res.status(500).send({ msg: "Error while saving the user" });
                }
            }
            
        }else{
            const u = await User.findOne({email});
            if(u)return res.status(409).send({msg:"Account with the email "+email+" already exist.Please try different account.",field:'email'});
            await generateAndSendOtp(email,res,"verify-email");
        }
    }catch (error) {
        if (error.code === 11000) {
            return res.status(400).send({ msg: "Email already exists" });
        } else {
            console.error(error);
            return res.status(500).send({ msg: "Internal server error",error });
        }
    }
});
authRouter.post("/forgot-pass",async(req,res)=>{
    try{
        const {email,password,otp} = req.body;
        if(otp){
            const obj = await Otp.findOne({email});
            if(!obj){
                return res.status(403).send({msg:"Otp expired. please generate new otp"});
            }else{
                if(obj.otp !== otp){
                    return res.status(403).send({msg:"Otp verification failed. please enter correct otp"});
                }else{
                    const user = await User.findOne({email});
                    user.password = password;
                    let suc = await user.save();
                    if(suc){
                        return res.status(200).send("Successfully changed the password");
                    }else{
                        return res.status(500).send({msg:"Error while intereacting with the database server"})
                    }
                }
            }
        }else{
            if(!email || !password)return res.status(400).send({msg:"All the fields are required"});
            const u = await User.findOne({email});
            if(!u)return res.status(400).send({msg:"No user account found with email "+email,field:"email"});
            await generateAndSendOtp(email,res,"forgot-pass");
        }
    }catch(e){
        console.log(e)
        return res.status(500).send({msg:"Internal server error"});
    }
})
authRouter.post('/signIn',async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password)return res.status(422).send({msg:"Missing data"});
        const u =await User.findOne({email});
        if(!u)return res.status(402).send({msg:"We couldn't find any account associated with this email.",field:"email"});
        const isSame =await bcrypt.compare(password,u.password);
        if(!isSame){
            return res.status(422).send({msg:"Password didn't match with the one that you provided in the past.",field:"password"});
        }
        const token = jsonwebtoken.sign({_id:u._id},process.env.JSONKEY,{expiresIn: '300h'});
        return res.status(200).send({u,token});
    }catch (error) {
        console.error(error);
        return res.status(500).send({ msg: "Internal server error",error });
    }
});
authRouter.post("/getLoginStatus",authenticate,async(req,res)=>{
    try{
        const {user} = req.body;
        return res.status(200).send({user});
    }catch (e){
        return res.status(500).send("Internal server error while proccessing your request pls try after some time")
    }
})
authRouter.post('/signOut',authenticate,(req,res)=>{
   res.clearCookie('token')
   return res.status(200).send({msg:"Successfully logged out"})
});
module.exports = authRouter