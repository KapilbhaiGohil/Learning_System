import mongoose from "mongoose";
import config from '../config.js'

let local_db_uri = config.authLocalDBUri

const connectDB = async(isLocal)=>{
    if(isLocal){
        await mongoose.connect(local_db_uri).then(()=>{
            console.log("Mongodb Connected Locally")
        }).catch((e)=>console.log(e));
    }
}
export {connectDB};