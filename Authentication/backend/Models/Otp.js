import mongoose from "mongoose";
import {mailSender} from '../Utils/mailSender.js'
import otpGenerator from 'otp-generator'

const otpSchema = new mongoose.Schema(
    {
        email:{type:String,required:true},
        otp:{type:String,required:true},
        times:{type:Number,required:true},
        createdAt:{type:Date,default:()=>Date.now(),expires:600}
    }
)
const sendEmailForVerification= async function(email,otp,title,body){
    const info = await mailSender(
        email,
        title,
        body
    );
}
const Otp = mongoose.model('Otp',otpSchema);

let style = `
<style>
                *{
                  font-family: 'Segoe UI',Tahoma,Verdana,Arial,sans-serif;  
                  margin: 0;
                  padding: 0;
                }
                td{
                    padding-top: 1.5rem;
                }
                .heading{
                    font-size: 2rem;
                    color: #2672ec;
                    padding-top: 0.3rem;
                }
                .main{
                    padding: 0;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #707070;
                }
                .code{
                    font-weight: bold;
                }
                .greet{
                    font-weight: bold;
                    color: #3a6074;
                }
                .email{
                    color: #2672ec;
                }
            </style>
`
const generateAndSendOtp = async function (email,res,purpose){
    let otp = otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
    let already = await Otp.findOne({email});
    let OtpInstance;
    if(already){
        if(already.times ===5){
            return res.status(429).send({msg:"To many attempts for otp from "+email+" please try after some time.",field:"email"});
        }else{
            OtpInstance = await new Otp({email,otp,times:already.times+1});
            await Otp.deleteOne({email});
        }
    }
    if(!OtpInstance)OtpInstance = await new Otp({email,otp,times:1});
    const saved = await OtpInstance.save();
    let title,body;
    if(saved){
        if(purpose === 'verify-email'){
             title = "Unknown Study Account Creation";
             body = `
            ${style}
            <div>
                <table>
                    <tbody>
                        <tr><td class="main">Unknow Study Account Management</td></tr>
                        <tr><td class="heading">Account creation code</td></tr>
                        <tr><td>Use the below given code for create the unknown study account with <span class="email">${email}</span></td></tr>
                        <tr><td>One Time Password (OTP) code is : <span class="code"> ${otp}</span></td></tr>
                        <tr>
                            <td class="greet">
                                Thanks,<br>
                                The Unknown Study Account Team
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            `;
        }else if(purpose === "forgot-pass"){
            title = "Unknown Study modify account"
            body = `
            ${style}
             <div>
                <table>
                    <tbody>
                        <tr><td class="main">Unknow Study Account Management</td></tr>
                        <tr><td class="heading">Account password reset code</td></tr>
                        <tr><td>Use the below given code for changing the password of  account  <span class="email">${email}</span></td></tr>
                        <tr><td>One Time Password (OTP) code is : <span class="code"> ${otp}</span></td></tr>
                        <tr>
                            <td class="greet">
                                Thanks,<br>
                                The Unknown Study Account Team
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        }
        console.log("Otp is ",otp);
        await sendEmailForVerification(email,otp,title,body);
        return res.status(200).send({msg:'Otp successfully sent to your email'})
    }else{
        return res.status(400).send({msg:'Failed to send otp'})
    }
}
export {Otp,generateAndSendOtp,style};