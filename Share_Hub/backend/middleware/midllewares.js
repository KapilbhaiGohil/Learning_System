import fetch from "node-fetch";
import config from "../config.js";
import multer from "multer";
import path from "path";
import fs from "fs";
const authDomain = config.authDomain

export const getUser = async (req,res,next)=>{
    try{
        const token = req.body.token;
        const authRes = await fetch(authDomain+'/user/getUserByCookie',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({token})
        });
        if(authRes.ok) {
            req.body.activeUser = await authRes.json();
        }else{
            const data = await authRes.json();
            return res.status(401).send({msg:data.msg,field:data.field})
        }
    }catch (e) {
        console.log(e);
        return res.status(500).send({msg:e.message})
    }
    next();
}
export async function GetUserFromAuthReq(token){
    const authRes = await fetch(authDomain+'/user/getUserByCookie',{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({token})
    });
    if(authRes.ok){
        return await authRes.json();
    }else{
        return null;
    }
}
const storage = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,'./uploads');
    },
    filename:function (req,file,cb){
        let ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, path.basename(file.originalname,ext)+'-'+uniqueSuffix+ext)
    }
})
export const upload = multer({storage:storage});
export const uploadMultipleFiles=(req,res,next)=>{
    upload.single('inputFile')(req,res,(e)=>{
        if(e){
            console.error('File upload failed:', e);
            return res.status(500).json({ error: 'File upload failed', details: e.message });
        }
        next();
    });
}