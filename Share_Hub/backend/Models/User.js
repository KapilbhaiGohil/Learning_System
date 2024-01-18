const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email:{type:String,required:true,unique:true,trim:true},
        material:[{type:mongoose.Schema.Types.ObjectId,ref:'Material'}]
    },
);
const User = mongoose.model('User',userSchema);
module.exports = User;