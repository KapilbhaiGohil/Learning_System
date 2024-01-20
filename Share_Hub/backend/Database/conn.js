import mongoose from 'mongoose'
import config from "../config.js";
const shareHubLocal = config.shareHubLocalDbUri
const connectDBs = async()=>{
    try{
        await mongoose.connect(shareHubLocal).then(()=>{console.log("Share hub db connected.")}).catch((e)=>{console.log(e)})
    }catch(e){
        console.log(e);
    }
}
export {connectDBs,mongoose}