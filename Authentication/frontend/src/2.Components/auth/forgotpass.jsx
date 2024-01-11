import { SimpleButton, SimpleInputWithImage } from "./basicComponent";
import uimg from "../../Assets/user.png"
import pimg from "../../Assets/password.png"
import {   useNavigate,Outlet, useOutlet, Link, useOutletContext } from "react-router-dom";
import { useState } from "react";

export default function ForgotPassword(){
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState({msg:'',field:''});
    const outlet = useOutlet();
    const emailChange = function (e){
        setEmail(e.target.value);
        if(error.field==='email'){
            setError({msg:'',field:''})
        }
    }
    const passChange =function (e){
        setPassword(e.target.value);
        if(error.field==='password'){
            setError({msg:'',field:''})
        }
    }
    const forgotPassSubmit = async function(e){
        e.preventDefault();
        setError({msg:'',field:''})
        if(e.target.confirmPass.value !== e.target.password.value){
            setError({msg:'your password and re-entered password don\'t match.',field:'password'})
        }else{
            const res = await fetch("/auth/forgot-pass",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({email:email,password:password}),
            });
            if(res.ok){
                navigate('verify-email');
            }else{
                const data = await res.json();
                setError({msg:data.msg,field:data.field})
            }
        }
    }
    return (
        <>
        {!outlet &&<> <div>
                <h2>Forgot-Password</h2>
            </div>
            <form onSubmit={forgotPassSubmit}>
                <div>
                    <SimpleInputWithImage name={'email'} onchange={emailChange} errmsg={error.field==='email' && error.msg} inputContainerClass={error.field==='email' && 'err-input-container'} img={uimg} required={true} type={'email'} placeholder={"Enter email"}  />
                </div>
                <div>
                    <SimpleInputWithImage name={'password'} img={pimg} inputContainerClass={error.field==='password' && 'err-input-container'}  onchange={passChange} required={true} type={'password'} placeholder={"Enter new password"} />
                </div>
                <div>
                    <SimpleInputWithImage name={'confirmPass'} errmsg={error.field==='password' && error.msg} onchange={passChange} inputContainerClass={error.field==='password' && 'err-input-container'} img={pimg} required={true} type={'password'} placeholder={"Re-enter new password"} />
                </div>
                <div className="auth-buttons">
                    <div>
                        <SimpleButton btnstyle={{background:"rgb(159, 148, 148)"}} type={'button'} onclick={()=>{navigate("../")}} label={"Back"}></SimpleButton>
                    </div>
                    <div>
                        <SimpleButton  type={'submit'} label={"Next"}></SimpleButton>
                    </div>
                </div>
            </form></>}
            {outlet && <Outlet context={[email,password]}/>}
        </>
    )
}
export function ForgotPassSuccess(){
    const [email,password] = useOutletContext();
    return(
        <>
            <div>
                <h2>Succssfull !</h2>
            </div>
            <div>
                <p style={{marginTop:"1rem"}}>Your account password with email {email} has been successfully updated.</p>
                <p>You can now <Link to={'../../'}>login</Link> to your account with the new passsowrd you provided.</p>
                <b><p style={{marginTop:"1rem"}}>Thanks for trusting us.</p></b>
            </div>
        </>
    )
}