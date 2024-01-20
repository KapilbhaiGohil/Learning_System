import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        email:{type:String,required:true,unique:true,trim:true},
        material:[{type:mongoose.Schema.Types.ObjectId,ref:'Material'}],
        driveFolderId:{type:String}
    },
);
const User = mongoose.model('User',userSchema);
export default User;