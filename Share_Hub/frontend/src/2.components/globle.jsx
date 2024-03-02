import "../3.styles/globle.scss"
import logo from "../5.assets/finalLogo.png"
import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Context} from "../Context";
import {Cookies} from "react-cookie";
import {Block, Groups, MailOutline, Notifications} from "@mui/icons-material";
import {fetchNotificationReq, sendResposeForInvitationReq} from "./home/fetchRequest-1";

//color defined
export const $cardBack = "#b6e2e7";
export const $navback =  "black";
export const $blueColor="#2f81f7";
export const $borderColor="#373737";
export const $fontColor="#dfdfdf";
export const $bodyBack="#0d1117";
export const $err="#f51717";
export const $borderColor2="#5f5f5f";
export const $lightBlue='#447bff';
export const url = "http://localhost:8080"
const cookies = new Cookies();
export const token = cookies.get('token');

export function Navbar(){
    const [notification,setNotification] = useState({show:false,fetching:false,notifications:[]});
    const [error,setError] = useState({msg:'',field:''})
    const {setRefresh} = useContext(Context)
    useEffect(() => {
         async function helper(){
             setError({msg:'',field:''});
             setNotification({...notification,fetching: true});
            const {res,data} = await fetchNotificationReq();
            if(res.ok){
                setNotification({...notification,fetching: false,notifications: data});
            }else{
                setError({msg:data.msg});
                setNotification({...notification,fetching: false});
            }
        }
        if(notification.show)helper();
    }, [notification.show]);
    const sendResponseForInvitation = async(joined,nid)=>{
        const {res,data} = await sendResposeForInvitationReq(joined,nid)
        if(res.ok){
            setRefresh(prev=>!prev);
            setNotification({...notification,show: false})
        }else{
            window.alert(data.msg);
        }
    }
    return (
        <>
            <nav>
                <div className="nav-div">
                    <div className={'nav-logo'}>
                        <img src={logo} width={"170px"} alt="logo" />
                    </div>
                    <div className="nav-heading">Share Hub</div>
                </div>
                <div className={"nav-links"}>
                    <ul>
                        <li onClick={(e)=>{setNotification({...notification,show:!notification.show})}}>
                            <Notifications/>
                        </li>
                    </ul>
                </div>
            </nav>
            {notification.show && <NotificationDisplay sendResponseForInvitation={sendResponseForInvitation} notifications={notification.notifications}/>}
        </>
    )
}
function NotificationDisplay({notifications,sendResponseForInvitation}){
    return(
        <>
            <div className={'notification-outer'}>
                {notifications.length>0 ? notifications.map((n,i)=><InvitationNotification sendResponseForInvitation={sendResponseForInvitation} notification={n} key={i} info={n}/>):
                    <div className={'notification-empty'}>
                        <Block/>
                        No notifications.
                    </div>
                }
            </div>
        </>
    )
}
function InvitationNotification({info,notification,sendResponseForInvitation}){
    return(
        <>
            <div className={'invitation'}>
                <div className={'icon-and-msg'}>
                    <MailOutline/>
                    <p><span>{info.by.name.substring(0,50)}</span> has invited you to join the material <span>{info.fields.material.name}</span></p>
                </div>
                <p>Do you want to join material ?</p>
                <div className={'inviation-buttons'}>
                    <button onClick={(e)=>{sendResponseForInvitation(true,notification._id)}}>join</button>
                    <button  onClick={(e)=>{sendResponseForInvitation(false,notification._id)}} className={'close-btn'} style={{marginRight:'1rem'}}>Ignore</button>
                </div>
            </div>
        </>
    )
}