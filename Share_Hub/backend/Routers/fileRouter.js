import express from "express";
import multer from 'multer';
import * as path from "path";
import {createFolder, uploadFile} from "../Utils/cloudFunctions.js";
import fs from "fs";
import config from "../config.js";
const fileRouter = express.Router()
const storage = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,'./uploads');
    },
    filename:function (req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname + '-' + uniqueSuffix)
    }
})
const upload = multer({storage:storage});
fileRouter.post('/upload',upload.single('fieldname'),async (req,res)=>{
    const filePath = path.join('./uploads',req.file.filename);
    const driveFolderId = '14d7Ejz2ZHV8G05QkUA6qOa3jXBLo2ask';
    try{
        await uploadFile(filePath,req.file.originalname,driveFolderId);
        fs.unlink(filePath,(err)=>{
            if(err)console.log(e)
            else console.log("File Successfully deleted")
        })
        res.status(200).send({msg:"File uploaded Succesfully"})
    }catch (e){
        console.log(e);
        res.status(500).send({msg:"Internal server error occured. pleaase try after some time"})
    }
})
fileRouter.post('/uploadFolder',async(req,res)=>{
    const folder  = await createFolder('demofolder',config.rootFolderId);
    return res.json(folder);
})
export default fileRouter;