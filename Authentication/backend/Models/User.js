import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true,minLength:5,maxLength:50},
        email:{type:String,required:true,unique:true,trim:true},
        password:{type:String,required:true,trim:true,
            minLength:10,maxLength:50},
    },
    {
        timestamps:true
    }
);

userSchema.pre('save',async function(next){
    try{
        if(this.isModified('password')){
            const salt = await bcrypt.genSaltSync(10);
            this.password = await bcrypt.hash(this.password,salt);
        }
        next();
    }catch (e) {
        console.error('Error while hashing the password : ', e);
        next(e);
    }
})
//use mmodel
const User = mongoose.model('User',userSchema);
export {User};