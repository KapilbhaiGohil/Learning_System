import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv"
const MaterialRouter = express.Router()
MaterialRouter.use(express.json())
dotenv.config({path:"../../../config.env"})
const authDomain = process.env.AUTH_DOMAIN

MaterialRouter.post('/create',async(req,res)=>{
    try{
        console.log("this is auth domain",authDomain)
        const token = req.cookies.token;
        const authRes = await fetch(authDomain+'/user/getUserByCookie',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(token)
        });
        if(authRes.ok){
            const data = await authRes.json();
            return res.status(200).json(data);
        }else{
            return res.status(401).send({msg:data.msg})
        }
    }catch(e){
        console.log(e)
        return res.status(500).send({msg:"Internal server error"})
    }
})

export {MaterialRouter};