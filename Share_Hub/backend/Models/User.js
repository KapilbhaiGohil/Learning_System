import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        email:{type:String,required:true,unique:true,trim:true},
        materials:[{type:mongoose.Schema.Types.ObjectId,ref:'Material'}],
        name:{type:String,required:true}
    },
);
const User = mongoose.model('User',userSchema);
export default User;