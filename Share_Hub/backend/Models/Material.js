import mongoose from "mongoose";
const materialSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
        creator:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
        backImg:{type:String},
        desc:{type:String,trim:true},
        driveFolderId:{type:String,required:true}
    }
)
export const Material = mongoose.model('Material',materialSchema)

const topicSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
        driveFolderId:{type:String,required:true}
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
