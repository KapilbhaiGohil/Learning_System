import { SimpleButton, SimpleInputWithImage } from "./basicComponent";
import uimg from "../../Assets/user.png"
import pimg from "../../Assets/password.png"
import eimg from "../../Assets/email.png"
import {Link, Outlet, useNavigate, useOutlet, useOutletContext} from "react-router-dom";
import { useState } from "react";
import {$err} from "../../3.Styles/globle.js"
const url = "http://localhost:8000"
export default function Register(){
    const [email,setEmail] = useState('');
    const [error,setError] = useState({msg:'',field:''})
    const [user,setUser] = useState({name:'',password:''});
    const [action,setAction] = useState({fetching:false});
    const navigate = useNavigate();
    const outlet = useOutlet();
    const emailChange = function(e){
        setEmail(e.target.value)
        if(error.field==='email'){
            setError({msg:'',field:''})
        }
    }
    const userChange = function (e){
        setUser({...user,[e.target.name]:e.target.value})
    }
    const register = async function (e){
        e.preventDefault();
        setAction({fetching: true})
        setError({msg:'',field:''})
        const res = await fetch(url+'/auth/signUp',{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({email,name:user.name,password:user.password})
        });
        // console.log(res);
        if(res.ok){
            navigate('verify-email');
        }else{
            const data = await res.json();
            setError({msg:data.msg,field:data.field})
        }
        setAction({fetching: false})
    }
    return (
        <>
            {!outlet && <> <div>
                <h2>Register</h2>
            </div>
            <form onSubmit={register}>
                {error.msg.length>0 && error.field!=='email'&& <p style={{color:$err,marginTop:"0.5rem",fontSize:"0.8rem"}}>{error.msg}</p>}
                <div>
                    <SimpleInputWithImage value={user.name} img={uimg} required={true} onchange={userChange} name={"name"} type="text" placeholder="Full name"  />
                </div>
                <div>
                    <SimpleInputWithImage value={user.email} img={eimg} errmsg={error.field==='email' && error.msg} inputContainerClass={error.field==='email' && 'err-input-container'}  onchange={emailChange} required={true} name={"email"} type={'email'} placeholder={"Enter email"}  />
                </div>
                <div>
                    <SimpleInputWithImage img={pimg} required={true} onchange={userChange} name={"password"} type={'password'} placeholder={"Enter password"} />
                </div>
                <div className="auth-buttons">
                    <SimpleButton btnstyle={{background:"rgb(159, 148, 148)"}} disabled={action.fetching} type={'button'} onclick={()=>{navigate("../")}} label={"Back"}></SimpleButton>
                    <SimpleButton type={'submit'} isloading={action.fetching} label={"Next"}></SimpleButton>
                </div>
            </form>
        </>}
            {outlet && <Outlet context={[user,email]}/>}
        </>
    )
}
export function Success(){
    const [user] = useOutletContext();
    return(
        <>
            <div>
                <h2>Succssfull !</h2>
            </div>
            <div>
                <p style={{marginTop:"1rem"}}>Your account with email {user.email} has been successfully created.</p>
                <p>You can now <Link to={'../../'}>login</Link> to your account with the credential you provided.</p>
                <b><p style={{marginTop:"1rem"}}>Thanks for trusting us.</p></b>
            </div>
        </>
    )
}