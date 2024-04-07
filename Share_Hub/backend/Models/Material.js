import mongoose, {mongo} from "mongoose";
const materialSchema = new mongoose.Schema(
    {
        creator:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
        name:{type:String,required:true,trim:true,minLength:4,maxLength:50},
        desc:{type:String,trim:true,required:true,minLength:10,maxLength:500},
        likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
        comments:[{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}],
        code:{type:String,required:true,unique:true,trim:true},
        users:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]
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

const categories = ['Invitation','News','Html'];
const notificationSchema = new mongoose.Schema(
    {
        by:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
        to:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        category:{type:String,enum:categories,required:true},
        fields:{type:mongoose.Schema.Types.Mixed,required:true},
        toAll:{type:Boolean,default:false},
        seen:{type:Boolean,default:false}
    }
)
export const NotificationCollection = mongoose.model('Notification',notificationSchema);