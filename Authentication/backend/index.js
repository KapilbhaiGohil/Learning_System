const express = require('express')
const dotenv = require('dotenv')
dotenv.config({path:"../../config.env"})
const app = express();
const connectDB = require('./Database/conn')
connectDB(true);
const authRouter = require('./Routers/authRouter')
const cookieParser = require("cookie-parser");
const userRouter = require('./Routers/userRouter');
const cors = require('cors');
//cookie parser
app.use(cors())
app.use(cookieParser());
//Routers are configured here
app.use('/auth',authRouter);
app.use('/user',userRouter)


app.listen(process.env.AUTH_PORT,()=>{
    console.log("server started at port "+process.env.AUTH_PORT);
});