import mongoose from "mongoose";
const materialSchema = new mongoose.Schema(
    {
        creator:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
        name:{type:String,required:true,trim:true},
        desc:{type:String,trim:true,required:true},
        likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
        comments:[{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}],
        code:{type:String,required:true}
    }
)
materialSchema.index({code:1});
export const Material = mongoose.model('Material',materialSchema)
const commentSchema = new mongoose.Schema(
    {
        by:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
        likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
        disLikes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
        comment:{type:String,required:true}
    },
    {
        timestamps:true
    }
)

export const Comment = mongoose.model('Comment',commentSchema);