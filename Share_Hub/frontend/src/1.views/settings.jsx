import "../3.styles/settings.scss"
import {useEffect, useState} from "react";
import {Switch} from "@mui/material";
import {$blueColor} from "../2.components/globle";
import {setOrGetAccessReq} from "../2.components/settings/fetchRequests";
import {CloudUploadOutlined, Delete, Download} from "@mui/icons-material";
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
export default function Settings(){
    const [option,setOption] = useState({name:'AccessRights'});

    return(
        <>
            <div className={'settings-outer'}>
                <div className={'settings-left'}>
                    {/*<p>Settings</p>*/}
                    <ul>
                        <li style={option.name==='AccessRights' ? {color:$blueColor} : {}}>Access Rights</li>
                    </ul>
                </div>
                <div className={'settings-right'}>
                    {option.name === 'AccessRights' && <AccessRightsInfo/>}
                </div>
            </div>
        </>
    )
}
export function AccessRightsInfo(){
    const [selected,setSelected] = useState({name:'Viewer'});
    const [accessInfo,setAccessInfo] = useState({});
    const [temp,setTemp] = useState({});
    useEffect(() => {
        async function helper(){
            const {res,data} = await setOrGetAccessReq(undefined,false);
            if(res.ok){
                setAccessInfo(data);
                setTemp(data);
            }else{
                window.alert(data.msg);
                console.log(data.e);
            }
        }
        helper();
    }, []);
    //rights are share,upload,delete,download
    const changeRights=(e,right)=>{
        setTemp({...temp,[selected.name]:{...temp[selected.name],[right]:e.target.checked}});
    }
    const saveAccessInfo=async(e)=>{
        const {res,data} = await setOrGetAccessReq(temp,true);
        if(res.ok){
            console.log(data);
            setAccessInfo(data);
            setTemp(data);
        }else{
            window.alert(data.msg);
            console.log(data.e);
        }
    }
    return (
        <>
            <div className={'access-right'}>
                <div className={'access-options'}>
                    <ul>
                        <li style={selected.name==='Viewer' ? {color:$blueColor} : {}}
                            onClick={(e)=>setSelected({name: 'Viewer'})}>Viewer</li>
                        <li style={selected.name==='Editor' ? {color:$blueColor} : {}}
                            onClick={(e)=>setSelected({name: 'Editor'})}>Editor</li>
                        <li style={selected.name==='Collaborator' ? {color:$blueColor} : {}}
                            onClick={(e)=>setSelected({name: 'Collaborator'})}>Collaborator</li>
                    </ul>
                </div>
                <div className={'access-details'}>
                    <ul>
                        <li>
                            <div>
                                <p>
                                    <Download/>
                                    Download
                                </p>
                                <p>If this options is enabled then the user can download any files or folder within the material you shared.</p>
                            </div>
                            <Switch onChange={(e)=>changeRights(e,'download')}
                                    checked={ temp[selected.name] ?  temp[selected.name].download :false}/>
                        </li>
                        <li>
                            <div>
                                <p>
                                    <ReplyOutlinedIcon style={{transform: "scaleX(-1)"}}/>
                                    Share
                                </p>
                                <p>If this option is  enabled then user can share material to others via code only.</p>
                            </div>
                            <Switch onChange={(e)=>changeRights(e,'share')}
                                    checked={ temp[selected.name] ?  temp[selected.name].share :false}/>
                        </li>
                        <li>
                            <div>
                                <p>
                                    <CloudUploadOutlined/>
                                    Upload
                                </p>
                                <p>If this option is enabled then user can upload files or folder to the material you shared.</p>
                            </div>
                            <Switch onChange={(e)=>changeRights(e,'upload')}
                                    checked={ temp[selected.name] ?  temp[selected.name].upload :false}/>
                        </li>
                        <li>
                            <div>
                                <p>
                                    <Delete/>
                                    Delete
                                </p>
                                <p>If this option is enabled then the user can delete any files or folder in the material you shared.</p>
                            </div>
                            <Switch onChange={(e)=>changeRights(e,'delete')}
                                    checked={ temp[selected.name] ?  temp[selected.name].delete :false}/>
                        </li>
                    </ul>
                    {JSON.stringify(temp) !== JSON.stringify(accessInfo) && <p className={'error-msg'} style={{float: "right"}}>You have unsaved changes.</p>}
                    <div>
                        <button onClick={saveAccessInfo}>Save Changes</button>
                    </div>
                </div>
            </div>
        </>
    )
}