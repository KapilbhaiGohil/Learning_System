const mongoose = require('mongoose')

local_db_uri = process.env.LOCALE_DB_URI

const connectDB = async(isLocal)=>{
    if(isLocal){
        await mongoose.connect(local_db_uri).then(()=>{
            console.log("Mongodb Connected Locally")
        }).catch((e)=>console.log(e));
    }
}
module.exports = connectDB;