const mongoose = require("mongoose")

const materialSchema = new mongoose.Schema(
    {
        name:{tyep:String,required:true,trim:trusted},
        creator:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
        backImg:{type:String},
        desc:{type:String,trim:true}
    }
)
const Material = mongoose.model('Material',materialSchema)

const topicSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
    }
)
const Topic = mongoose.model('Topic',topicSchema);

const infoSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
        desc:{type:String,require:true,trim:true},
        topic:{type:mongoose.Schema.Types.ObjectId,ref:'Topic'},
        attachment:{type:String}
    }
)
const Info = mongoose.model('Info',infoSchema);

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
const Assignment = mognoose.model('Assignment',assignmentSchema);

module.exports = {Material,Topic,Info,Assignment};