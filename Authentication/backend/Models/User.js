import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
        email:{type:String,required:true,unique:true,trim:true},
        password:{type:String,required:true},
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
export {User};