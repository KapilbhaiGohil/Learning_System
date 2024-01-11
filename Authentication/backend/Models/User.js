const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const roleOptions = ['Admin','Student','Educator']
const userSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
        email:{type:String,required:true,unique:true,trim:true},
        password:{type:String,required:true},
        role:{type:String,required:true,enum:roleOptions,default:'Student'},
    },
    {
        timestamps:true
    }
);

userSchema.pre('save',async function(next){
    try{
        if(this.isModified('password')){
            this.password = await bcrypt.hash(this.password,10)
            next();
        }else{
            next();
        }
    }catch (e) {
        console.error('Error while hashing the password : ', e);
        next(e);
    }
})
//use mmodel
const User = mongoose.model('User',userSchema);
module.exports = User;