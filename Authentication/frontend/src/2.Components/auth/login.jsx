import { Link, useNavigate } from "react-router-dom"
import { SimpleButton, SimpleInputWithImage } from "./basicComponent"
import uimg from "../../Assets/user.png"
import pimg from "../../Assets/password.png"
import { useState } from "react"
import {$err} from "../../3.Styles/globle.js"
export default function Login(){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('')
    const navigate = useNavigate();
    const [error,setError] = useState({msg:'',field:''});
    const handleEmailChange = function (e){
        setEmail(e.target.value);
        if(error.field==='email'){
            setError({msg:'',field:''})
        }
    }
    const handlePasswordChange = function (e){
        setPassword(e.target.value);
        if(error.field==='password'){
            setError({msg:'',field:''})
        }
    }
    const signin = async function (e){
        e.preventDefault();
        setError({msg:'',field:''})
        const res = await fetch('/auth/signIn',{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({email:email,password:password}),
        });
        if(res.ok){
            // navigate("/home");
            //temp solution
            window.location.replace('http://localhost:3000/home');
        }else{
            const data = await res.json();
            setError({msg:data.msg,field:data.field})
        }
    }
    return(
        <>
            <div>
                <h2>Signin</h2>
            </div>
            <form onSubmit={signin}>
                {error.msg.length>0 && error.field!=='email' && error.field !== 'password' && <p style={{color:$err,marginTop:"0.5rem",fontSize:"0.8rem"}}>{error.msg}</p>}
                <div>
                    <SimpleInputWithImage required={true} onchange={handleEmailChange} errmsg={error.field==='email' && error.msg} inputContainerClass={error.field==='email' && 'err-input-container'} img={uimg} type={'email'} placeholder={"Enter email"}  />
                </div>
                <div>
                    <SimpleInputWithImage required={true} errmsg={error.field==='password' && error.msg} inputContainerClass={error.field==='password' && 'err-input-container'} img={pimg} onchange={handlePasswordChange} type={'password'} placeholder={"Enter password"} />
                </div>
                <div className="auth-links">
                    <p>Don't have account? <Link to={'register'}>create one</Link> </p>
                    <p><Link to={'forgot-pass'}>Fortgot your password ?</Link></p>
                </div>
                <div>
                    <SimpleButton type={'submit'}  label={"Signin"}></SimpleButton>
                </div>
            </form>
        </>
    )
}