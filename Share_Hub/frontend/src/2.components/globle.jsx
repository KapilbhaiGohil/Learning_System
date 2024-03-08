import "../3.styles/globle.scss"
import logo from "../5.assets/finalLogo.png"
import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Context} from "../Context";
import {Cookies} from "react-cookie";
import {
    Block,
    CloseOutlined,
    Groups,
    Logout,
    MailOutline,
    Notifications,
    Person,
    PersonAddAlt
} from "@mui/icons-material";
import {fetchNotificationReq, sendResposeForInvitationReq} from "./home/fetchRequest-1";
import {Tooltip} from "@mui/material";
import {CustomCircularProgress} from "./home/components";
import SettingsIcon from '@mui/icons-material/Settings';

//color defined
export const $cardBack = "#b6e2e7";
export const authUrl = 'http://localhost:3001/auth';
export const $navback =  "black";
export const $blueColor="#2f81f7";
export const $darkBlue = '#003578';
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
    const [isProfile,setIsProfile] = useState(false);
    const navigate = useNavigate();
    const {setRefresh,activeUser} = useContext(Context)
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
            setNotification({...notification,show: false,notifications: []})
        }else{
            window.alert(data.msg);
        }
    }
    const profileIconClick=(e)=>{
        setNotification({...notification,show:false});
        setIsProfile(!isProfile);
    }
    return (
        <>
            <nav>
                <div className="nav-div">
                    <div className={'nav-logo'}>
                        <img src={logo} width={"170px"} alt="logo" />
                    </div>
                    <div className="nav-heading" onClick={(e)=>navigate('/home')}>Share Hub</div>
                </div>
                <div className={"nav-links"}>
                    <ul>
                        <Tooltip arrow title={'Notifications'}>
                            <li onClick={(e)=>{setNotification({...notification,show:!notification.show});setIsProfile(false)}}>
                                <Notifications/>
                            </li>
                        </Tooltip>
                        <Tooltip arrow title={`Hi,${activeUser.name}`}>
                            <li onClick={profileIconClick}>
                                <img src={activeUser.profilePic} width={'20px'}/>
                            </li>
                        </Tooltip>
                    </ul>
                </div>
            </nav>
            {isProfile && <ProfileOptions setIsProfile={setIsProfile} />}
            {notification.show && <NotificationDisplay sendResponseForInvitation={sendResponseForInvitation} notification={notification}/>}
        </>
    )
}
function NotificationDisplay({notification,sendResponseForInvitation}){
    return(
        <>

            <div className={'notification-outer'}>
                {notification.fetching ?
                    <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                        <CustomCircularProgress precentage={70} trackColor={'transparent'} progressColor={$blueColor}/>
                    </div>
                    :
                    (notification.notifications.length>0 ? notification.notifications.map((n,i)=><InvitationNotification sendResponseForInvitation={sendResponseForInvitation} notification={n} key={i} info={n}/>):
                            <div className={'notification-empty'}>
                                <Block/>
                                No notifications.
                            </div>
                    )
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
                    <PersonAddAlt/>
                    <p><span>{info.by.name.substring(0,50)}</span> has invited you to join the material <span>{info.fields.material.name} </span>
                         as a {info.fields.access}
                        <br/>Do you want to join material ?
                    </p>
                </div>
                <div className={'inviation-buttons'}>
                    <button onClick={(e)=>{sendResponseForInvitation(true,notification._id)}}>join</button>
                    <button  onClick={(e)=>{sendResponseForInvitation(false,notification._id)}} className={'close-btn'} style={{marginRight:'1rem'}}>Ignore</button>
                </div>
            </div>
        </>
    )
}
function ProfileOptions({setIsProfile}){
    const {activeUser} = useContext(Context);
    const navigate = useNavigate();
    const handleLogOut=(e)=>{
        cookies.remove('token');
        setIsProfile(false);
        window.location.replace(authUrl);
    }
    return(
        <>
            <div className={'profile-options'}>
                <div className={'profile-options-outer'}>
                    <div className={'profile-options-details'}>
                        <div>
                            <div>
                                <img src={activeUser.profilePic} width={'20px'}/>
                            </div>
                            <div>
                                <p style={{fontSize:"1.6rem"}}>{activeUser.name}</p>
                                <p>{activeUser.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'profile-options-desc'}>
                        <div style={{width:"50%"}} onClick={(e)=>{navigate('/settings');setIsProfile(false)}}>
                            <SettingsIcon/>
                            <span>Settings</span>
                        </div>
                        <div onClick={handleLogOut}>
                            <Logout/>
                            <span>Log out</span>
                        </div>
                    </div>
                    {/*<div onClick={handleLogOut} className={'profile-logout-btn'}>*/}
                    {/*    <Logout/>*/}
                    {/*    <span>Log out</span>*/}
                    {/*</div>*/}
                </div>
            </div>
        </>
    )
}