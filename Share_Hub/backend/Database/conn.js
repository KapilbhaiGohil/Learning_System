import mongoose from 'mongoose'
import dotenv from "dotenv"
dotenv.config({path:"../../config.env"})
const shareHubLocal = process.env.LOCAL_DB_SHAREHUB
const authenticationLocal = process.env.LOCALE_DB_URI
console.log(shareHubLocal)
const connectDBs = async()=>{
    try{
        await mongoose.connect(shareHubLocal).then(()=>{console.log("Share hub db connected.")}).catch((e)=>{console.log(e)})
    }catch(e){
        console.log(e);
    }
}
export {connectDBs,mongoose}