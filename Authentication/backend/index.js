import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './Database/conn.js';
import {authRouter} from './Routers/authRouter.js';
import {userRouter} from './Routers/userRouter.js';
import cors from 'cors';
import cookieParser from 'cookie-parser'
dotenv.config({path:"../../config.env"})
const app = express();
connectDB(true);
//cookie parser
app.use(cors())
app.use(cookieParser());
//Routers are configured here
app.use('/auth',authRouter);
app.use('/user',userRouter)


app.listen(process.env.AUTH_PORT,()=>{
    console.log("server started at port "+process.env.AUTH_PORT);
});