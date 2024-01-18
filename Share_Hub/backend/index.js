import express from "express";
import  dotenv from "dotenv";
import  {connectDBs}  from "./Database/conn.js";
import cookieParser from 'cookie-parser';
import {MaterialRouter} from './Routers/materialRouter.js'
dotenv.config({path:"../../config.env"})
const app = express();
const dbs = connectDBs();
//cookie parser
app.use(cookieParser());
app.use('/material',MaterialRouter);
//Routers are configured here

app.listen(process.env.PORT_SHAREHUB,()=>{
    console.log("server started at port "+process.env.PORT_SHAREHUB);
});