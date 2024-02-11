import { useNavigate } from "react-router-dom";
import { OtpInput } from "./basicComponent";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
const url = "http://localhost:8000"
export default function OtpVerification() {
    const [user,email] = useOutletContext();
    const [otpError,setOtpError] = useState({msg:''})
    const navigate = useNavigate();
    const onSubmit=async function(e){
        e.preventDefault();
        setOtpError({msg:''})
        let otp = e.target.first.value+e.target.second.value+e.target.third.value+e.target.fourth.value+e.target.fifth.value+e.target.sixth.value;
        console.log(otp)
        if(otp.length !==6 || otp.includes(' ')){
            setOtpError({msg:'Pls fill out all the digits before submitting'});
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
    }
    return (
        <>
            <OtpInput email={email} onSubmit={onSubmit} otpError={otpError} setOtpError={setOtpError} title={'Email Verification'}/>
        </>
    );
}
