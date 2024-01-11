const User = require('../Models/User')
const jsonwebtoken = require('jsonwebtoken')

const authenticate = async function(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).send({ msg: "Unauthorized request - Missing Token" });
    }
    try{
        const obj = await jsonwebtoken.verify(token,process.env.JSONKEY)
        const user = await User.findOne({_id:obj._id})
        req.body.user = user;
        next();
    }catch (e) {
        console.error(e)
        return res.status(401).send({msg:"Unauthorized request - Invalid Token"})
    }
}
module.exports = authenticate;