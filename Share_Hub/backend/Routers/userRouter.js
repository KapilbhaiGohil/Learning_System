import express from 'express'
import {getUser} from "../middleware/midllewares.js";
const userRouter = express.Router();
userRouter.use(express.json())
userRouter.post('/getUser',getUser,async(req,res)=>{
    try{
        const {activeUser} = req.body;
        return res.status(200).json(activeUser);
    }catch (e) {
        return res.status(500).send({msg:"Internal server error."})
    }
})
export {userRouter};