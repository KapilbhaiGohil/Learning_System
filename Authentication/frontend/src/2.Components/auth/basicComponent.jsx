import { useNavigate } from "react-router-dom";
import {$err} from "../../3.Styles/globle.js"
import {Password} from "@mui/icons-material";
import {CircularProgress} from "@mui/joy";

export function SimpleInputWithImage({img,Icon,value,type,placeholder,required,onchange,maxLen,minLen,name,imgInputStyle,errmsg,inputContainerClass}){
    let className = "input-container";
    if(inputContainerClass)className=inputContainerClass+' '+className;
    return(
        <div className={className}>
            <div className="imginut-container" style={imgInputStyle}>
                <div className="img-outer">
                    {Icon ? <Icon/> : <img src={img} alt="" /> }
                </div>
                <div className="input-outer">
                    <input maxLength={maxLen} minLength={minLen} type={type} value={value} name={name} onChange={onchange} required={required} placeholder={placeholder}/>
                </div>
            </div>

            {errmsg &&<div className="error-msg">
                <p>{errmsg}</p>
            </div>}
        </div>
    )
}

export function SimpleButton({label,type,onclick,disabled,btnstyle,isloading=false}){
    return (
        <>
            <div className={"button-outer"} >
                <img src="" alt="" />
                {isloading ? <button disabled={true}>
                    <CustomCircularProgress precentage={70} trackColor={'transparent'} progressColor={'black'}/>
                </button> :
                    <button type={type} disabled={disabled} style={btnstyle} onClick={onclick}>{label}</button>
                }
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
                    <SimpleInputWithImage img={Password} name={'otp'} placeholder={'Enter 6-digit OTP here..'} minLen={6} maxLen={6} required={true}/>
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
export function CustomCircularProgress({color = 'primary',progressSize = '14px',thickness = 2,variant = 'soft',
                                           progressThickness='1px',size = 'sm',trackThickness = 2,progressColor = 'white',trackColor = 'black',precentage=25})
{
    return (
        <CircularProgress
            style={{
                '--CircularProgress-percent':precentage,
                '--CircularProgress-size': progressSize,
                '--_track-thickness': `${trackThickness}px`,
                '--CircularProgress-trackColor': trackColor,
                '--CircularProgress-progressColor': progressColor,
                '--_progress-thickness':progressThickness
            }} thickness={thickness} size={size} variant={variant} color={color}
        />
    );
}