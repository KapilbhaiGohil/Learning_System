import express from "express";
import  {connectDBs}  from "./Database/conn.js";
import cookieParser from 'cookie-parser';
import {MaterialRouter} from './Routers/materialRouter.js'
import config from "./config.js";
const app = express();
await connectDBs();
import fileRouter from './Routers/fileRouter.js'
//cookie parser
app.use(cookieParser());
app.use('/material',MaterialRouter);
app.use('/file',fileRouter)
//Routers are configured here

app.listen(config.shareHubPort,()=>{
    console.log("server started at port "+config.shareHubPort);
});