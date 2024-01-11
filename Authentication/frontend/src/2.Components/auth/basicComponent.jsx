import { useNavigate } from "react-router-dom";
import {$err} from "../../3.Styles/globle.js"

export function SimpleInputWithImage({img,value,type,placeholder,required,onchange,name,imgInputStyle,errmsg,inputContainerClass}){
    let className = "input-container";
    if(inputContainerClass)className=inputContainerClass+' '+className;
    return(
        <div className={className}>
            <div className="imginut-container" style={imgInputStyle}>
                <div className="img-outer">
                    <img src={img} alt="" />    
                </div>
                <div className="input-outer">
                    <input type={type} value={value} name={name} onChange={onchange} required={required} placeholder={placeholder}/>
                </div>
            </div>

            {errmsg &&<div className="error-msg">
                <p>{errmsg}</p>
            </div>}
        </div>
    )
}

export function SimpleButton({label,type,onclick,btnstyle}){
    return (
        <>
            <div className={"button-outer"} >
                <img src="" alt="" />
                <button type={type} style={btnstyle} onClick={onclick}>{label}</button>
            </div>
        </>
    )
}
export function OtpInput({title,onSubmit,email,otpError,setOtpError,}){
    const navigate = useNavigate();
    const inputClick = function (e) {
        const previd = parseInt(e.target.id) + 1;
        const prev = document.getElementById(previd-1);
        if(prev && parseInt(prev.id)!==6)prev.disabled = true;
        let next = document.getElementById(previd.toString());
        if (e.key === 'Backspace') {
            next = document.getElementById((previd - 2).toString());
            if(prev && parseInt(prev.id)===1)prev.disabled = false;
            if(prev && parseInt(prev.id)===6)prev.disabled = true;
        }
        if (next) {next.disabled=false;next.focus(); }
        else prev.focus();
        if(otpError)setOtpError({msg:''})
    }
    return (
        <>
            <div>
                <h2>{title}</h2>
            </div>
            <form onSubmit={onSubmit} autoComplete={"off"}>
                <p style={{fontSize:"0.9rem",marginTop:"1rem"}}>We emailed the six digit code to <b>{email}</b></p>
                <p style={{fontSize:"0.9rem",marginTop:"0.2rem"}}>Enter the code below to cofirm your email address</p>
                <div className="otp-outer">
                    <div className="input-fields">
                        <input id="1" maxLength={"1"} required={true} name="first" disabled={false} onKeyUp={inputClick} />
                        <input id="2" maxLength={"1"} required={true} name="second" disabled={true} onKeyUp={inputClick} />
                        <input id="3" maxLength={"1"} required={true} name="third" disabled={true} onKeyUp={inputClick} />
                        <input id="4" maxLength={"1"} required={true} name="fourth" disabled={true} onKeyUp={inputClick} />
                        <input id="5" maxLength={"1"} required={true} name="fifth" disabled={true} onKeyUp={inputClick} />
                        <input id="6" maxLength={"1"} required={true} name="sixth" disabled={true} onKeyUp={inputClick} />
                    </div>
                    {otpError.msg.length > 0 && <p style={{color:$err,marginTop:"0.5rem",fontSize:"0.8rem"}}>{otpError.msg}</p>}
                    <div className="auth-buttons">
                        <div>
                            <SimpleButton btnstyle={{background:"rgb(159, 148, 148)"}} type={'button'} onclick={() => { navigate("../") }} label={"Back"}></SimpleButton>
                        </div>
                        <div>
                            <SimpleButton type={'submit'} label={"Next"}></SimpleButton>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}