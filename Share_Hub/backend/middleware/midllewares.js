import fetch from "node-fetch";
import config from "../config.js";
const authDomain = config.authDomain

export const getUser = async (req,res,next)=>{
    const token = req.cookies.token;
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
    next();
}