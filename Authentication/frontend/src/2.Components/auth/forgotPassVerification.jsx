import { useState } from "react";
import { OtpInput } from "./basicComponent";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function ForgoPassVerification(){
    const [otpError,setOtpError] = useState({msg:''});
    const [email,password] = useOutletContext();
    const navigate = useNavigate();
    const submitOtp = async function (e){
        e.preventDefault();
        setOtpError({msg:''});
        let otp = e.target.first.value+e.target.second.value+e.target.third.value+e.target.fourth.value+e.target.fifth.value+e.target.sixth.value;
        if(otp.length !==6 || otp.includes(' ')){
            setOtpError({msg:'Pls fill out all the digits before submitting'});
        }else{
            const res = await fetch('/auth/forgot-pass',{
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
    }
    return(
        <>
            <OtpInput title={'Email Verification'} email={email} otpError={otpError} setOtpError={setOtpError} onSubmit={submitOtp} />
        </>
    )
}