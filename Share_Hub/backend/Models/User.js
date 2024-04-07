import mongoose from "mongoose";
const category = ['Owner','Editor','Viewer','Collaborator'];
const userSchema = new mongoose.Schema(
    {
        email:{type:String,required:true,unique:true,trim:true},
        materials:[{material:{type:mongoose.Schema.Types.ObjectId,ref:'Material'},role:{type:String,enum:category,defalut:'Viewer'}}],
        name:{type:String,required:true,minLength:5,maxLength:50},
        accessInfo:{
            Editor:{share:{type:Boolean,default:false},upload:{type:Boolean,default:true},delete:{type:Boolean,default:true},download:{type:Boolean,default:true}},
            Viewer:{share:{type:Boolean,default:false},upload:{type:Boolean,default:false},delete:{type:Boolean,default:false},download:{type:Boolean,default:true}},
            Collaborator:{share:{type:Boolean,default:true},upload:{type:Boolean,default:true},delete:{type:Boolean,default:true},download:{type:Boolean,default:true}},
            Owner:{share:{type:Boolean,default:true},upload:{type:Boolean,default:true},delete:{type:Boolean,default:true},download:{type:Boolean,default:true}},
        }
    },
);
const User = mongoose.model('User',userSchema);
export default User;