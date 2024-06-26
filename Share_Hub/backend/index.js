import express from "express";
import  {connectDBs}  from "./Database/conn.js";
import cookieParser from 'cookie-parser';
import {MaterialRouter} from './Routers/materialRouter.js'
import config from "./config.js";
import {userRouter} from "./Routers/userRouter.js";
import cors from 'cors'
const app = express();
await connectDBs();
//cookie parser
app.use(cors({
    credentials:true
}))
app.use(cookieParser());
app.use('/material',MaterialRouter);
app.use('/user',userRouter)

//Routers are configured here

app.listen(config.shareHubPort,()=>{
    console.log("server started at port "+config.shareHubPort);
});