import { useNavigate } from "react-router-dom";
import {OtpInput, SimpleButton, SimpleInputWithImage} from "./basicComponent";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import {$err} from "../../3.Styles/globle";
import pimg from "../../Assets/password.png"
const url = "http://localhost:8000"
export default function OtpVerification() {
    const [user,email] = useOutletContext();
    const [otpError,setOtpError] = useState({msg:''})
    const [otp,setOtp] = useState('');
    const navigate = useNavigate();
    const [action,setAction] = useState({fetching:false});
    const onSubmit=async function(e){
        e.preventDefault();
        setOtpError({msg:''})
        setAction({fetching: true})
        if(otp.length !==6 || otp.includes(' ') || !/^\d+$/.test(otp)){
            setOtpError({msg:'Otp should contains 6-digit numeric value only without any blank space.'});
        }else{
            const res = await fetch(url+'/auth/signUp',{
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify({email,otp,name:user.name,password:user.password})
            });
            console.log(res);
            if(res.ok){
                navigate('../success');
            }else{
                const data = await res.json();
                setOtpError({msg:data.msg})
            }
        }
        setAction({fetching: false})
    }
    const otpChange = (e)=>{
        setOtp(e.target.value);
        if(otpError.msg.length>0)setOtpError({msg: ''})
    }
    return (
        <>
            <div>
                <h2>Email verification</h2>
            </div>
            <form onSubmit={onSubmit} autoComplete={"off"}>
                <p style={{fontSize:"0.9rem",marginTop:"1rem"}}>We emailed the six digit code to <b>{email}</b></p>
                <p style={{fontSize:"0.9rem",marginTop:"0.2rem"}}>Enter the code below to cofirm your email address</p>
                <div className="otp-outer">
                    <SimpleInputWithImage img={pimg} onchange={otpChange} name={'otp'} placeholder={'Enter 6-digit OTP here..'} minLen={6} maxLen={6} required={true}/>
                    {otpError.msg.length > 0 && <p style={{color:$err,marginTop:"0.5rem",fontSize:"0.8rem"}}>{otpError.msg}</p>}
                    <div className="auth-buttons">
                        <div>
                            <SimpleButton disabled={action.fetching} btnstyle={{background:"rgb(159, 148, 148)"}} type={'button'} onclick={() => { navigate("../") }} label={"Back"}></SimpleButton>
                        </div>
                        <div>
                            <SimpleButton type={'submit'} isloading={action.fetching} label={"Next"}></SimpleButton>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
