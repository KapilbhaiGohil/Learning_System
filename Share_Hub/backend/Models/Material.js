import mongoose from "mongoose";
const materialSchema = new mongoose.Schema(
    {
        creator:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
        name:{type:String,required:true,trim:true},
        desc:{type:String,trim:true,required:true},
        likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
        comments:[{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}]
    }
)
export const Material = mongoose.model('Material',materialSchema)
const commentSchema = new mongoose.Schema(
    {
        by:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
        likes:{type:Number,default:0},
        disLikes:{type:Number,default:0},
        comment:{type:String,required:true}
    },
    {
        timestamps:true
    }
)
export const Comment = mongoose.model('Comment',commentSchema);

const topicSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
    }
)
export const Topic = mongoose.model('Topic',topicSchema);

const infoSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
        desc:{type:String,require:true,trim:true},
        topic:{type:mongoose.Schema.Types.ObjectId,ref:'Topic'},
        attachment:{type:String}
    }
)
export const Info = mongoose.model('Info',infoSchema);

const assignmentSchema = new mongoose.Schema(
    {
        title:{type:String,required:true,trim:true},
        topic:{type:mongoose.Schema.Types.ObjectId,ref:'Topic'},
        desc:{type:String,trim:true},
        attachment:{type:String},
        points:{type:Number},
        dueDate:{type:Date}
    }
)
export const Assignment = mongoose.model('Assignment',assignmentSchema);
