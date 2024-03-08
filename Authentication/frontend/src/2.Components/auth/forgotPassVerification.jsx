import { useState } from "react";
import {OtpInput, SimpleButton, SimpleInputWithImage} from "./basicComponent";
import { useNavigate, useOutletContext } from "react-router-dom";
import pimg from "../../Assets/password.png";
import {$err} from "../../3.Styles/globle";
const url = "http://localhost:8000";
export default function ForgoPassVerification(){
    const [otpError,setOtpError] = useState({msg:''});
    const [email,password] = useOutletContext();
    const navigate = useNavigate();
    const [action,setAction] = useState({fetching:false});
    const [otp,setOtp] = useState('');
    const submitOtp = async function (e){
        e.preventDefault();
        setAction({fetching: true})
        setOtpError({msg:''});
        if(otp.length !==6 || otp.includes(' ') || !/^\d+$/.test(otp)){
            setOtpError({msg:'Otp should contains 6-digit numeric value only without any blank space.'});
        }else{
            const res = await fetch(url+'/auth/forgot-pass',{
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify({email,otp,password})
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
    return(
        <>
            <div>
                <h2>Email verification</h2>
            </div>
            <form onSubmit={submitOtp} autoComplete={"off"}>
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
            {/*<OtpInput title={'Email Verification'} email={email} otpError={otpError} setOtpError={setOtpError} onSubmit={submitOtp} />*/}
        </>
    )
}