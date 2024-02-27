import express from 'express'
import {getUser} from "../middleware/midllewares.js";
import {getDownloadUrlPath} from "../Utils/fileFunctions.js";
const userRouter = express.Router();
userRouter.use(express.json())
userRouter.post('/getUser',getUser,async(req,res)=>{
    try{
        let {activeUser} = req.body;
        activeUser.profilePic = await getDownloadUrlPath(activeUser._id+'/profilePic.png');
        return res.status(200).json(activeUser);
    }catch (e) {
        console.log(e);
        return res.status(500).send({msg:"Internal server error."})
    }
})
export {userRouter};