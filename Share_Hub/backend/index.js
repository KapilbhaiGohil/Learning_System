const express = require('express')
const dotenv = require('dotenv')
dotenv.config({path:"../../config.env"})
const app = express();
const connectDB = require('./Database/conn')
connectDB(true);
const cookieParser = require("cookie-parser");

//cookie parser
app.use(cookieParser());
//Routers are configured here

app.listen(process.env.PORT_SHAREHUB,()=>{
    console.log("server started at port "+process.env.PORT_SHAREHUB);
});