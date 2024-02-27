import mongoose from "mongoose";
const category = ['Owner','Editor','Viewer'];
const userSchema = new mongoose.Schema(
    {
        email:{type:String,required:true,unique:true,trim:true},
        materials:[{material:{type:mongoose.Schema.Types.ObjectId,ref:'Material'},role:{type:String,enum:category,defalut:'Viewer'}}],
        name:{type:String,required:true}
    },
);
const User = mongoose.model('User',userSchema);
export default User;