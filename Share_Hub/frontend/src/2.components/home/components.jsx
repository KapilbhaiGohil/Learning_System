import MoreVertIcon from '@mui/icons-material/MoreVert';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import logo from '../../5.assets/demo.jpg'
import FavoriteIcon from '@mui/icons-material/Favorite';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import {
    CloseOutlined,
    SentimentSatisfiedOutlined,
    ThumbDownOutlined,
    ThumbUpOutlined
} from "@mui/icons-material";
import {
    commentMaterial,
    createMaterial, deleteMaterialReq,
    getComments,
    joinMaterialRequest,
    likeMaterial,
    removeLikeMaterial
} from "./fetchRequest";
import {useContext, useEffect, useRef, useState} from "react";
import {Context} from "../../Context";
import {useNavigate} from "react-router-dom";
import {LinearProgress} from "@mui/material";
import {CircularProgress} from "@mui/joy";
import DeleteIcon from "@mui/icons-material/Delete";

export function MaterialCard({commentOnclick,updateMaterial,setProgress,setMaterials, shareOnClick ,index, materialObj}) {
    const material = materialObj.material;
    const {activeUser} = useContext(Context);
    const [like, setLike] = useState(false);
    const expandOptionsRef = useRef();
    const navigate = useNavigate();
    useEffect(() => {
        for (let i = 0; i < material.likes.length; i++) {
            if (activeUser && activeUser._id && material.likes[i] === activeUser._id.toString()) {
                setLike(true);
                break;
            }
        }
    }, [activeUser]);
    const likeFunction = async (e) => {
        let res, data;
        if (like) {
            ({res, data} = await removeLikeMaterial(material._id))
        } else {
            ({res, data} = await likeMaterial(material._id))
        }
        if (res.ok) {
            updateMaterial({...materialObj, ['material']: data}, index);
            setLike(!like);
        }else{
            navigate('/home');
        }
    }
    const materialClick = (e) => {
        navigate(`/material/${material._id}`);
    }
    const expandOptions = (e) => {
        let ele = expandOptionsRef.current;
        if (ele.style.display === 'block') {
            ele.style.display = 'none'
        } else {
            ele.style.display = 'block'
        }
    }
    const optionClicked = (option, e) => {
        switch (option) {
            case 'delete':

                break;
            case 'download':

                break;
            default:
                break;
        }
    }
    const deleteMaterial=async(e)=>{
        if(window.confirm('Deleting material will also deletes the material from the all user to whom you shared.\nAre you sure to delete material?')){
            setProgress(30);
            const {res,data} = await deleteMaterialReq(material._id);
            setProgress(100);
            if(res.ok){
                setMaterials(data);
            }else{
                window.alert(data.msg);
            }
        }
    }
    return (
        <>
            <div className={'material-card-outer'}>
                <div className={'material-card-heading'}>
                    <div onClick={materialClick} className={'material-card-heading-name'}>
                        <span>{material.name.substring(0,40)}{material.name.length>40 && '....'}</span>
                    </div>
                    <div className={'material-card-heading-right'}>
                        <div className={'material-card-heading-right-info'}>
                            {material.creator === activeUser._id ? 'Owner' : 'Shared'}
                        </div>
                        <div  className={'material-card-heading-right-options'}>
                            {/*<MoreVertIcon/>*/}
                            <DeleteIcon onClick={deleteMaterial}/>
                            {/*<div ref={expandOptionsRef} className={'material-card-heading-right-options-expand'}>*/}
                            {/*    <div onClick={(e) => optionClicked('download', e)}>Download</div>*/}
                            {/*    <div onClick={(e) => optionClicked('delete', e)}>Delete</div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
                <div className={'material-card-desc'}>
                    <p>{material.desc.substring(0,300)}{material.desc.length>300 && '....'}</p>
                </div>
                <div className={'material-card-options'}>
                    <div className={'material-card-options-right'}>
                        <div onClick={(e) => commentOnclick(materialObj, index)}>
                            <CommentOutlinedIcon/>
                            <span>{material.comments.length}</span>
                        </div>
                        <div onClick={likeFunction}>
                            {like ? <FavoriteIcon style={{color: "red"}}/> : <FavoriteBorderOutlinedIcon/>}
                            <span>{material && material.likes && material.likes.length}</span>
                        </div>
                        <div>
                            <GroupsOutlinedIcon/>
                            <span>{material.users.length}</span>
                        </div>
                    </div>
                    <div className={'material-card-options-left'} onClick={(e)=>shareOnClick(e,material)}>
                        <ReplyOutlinedIcon style={{transform: "scaleX(-1)"}}/>
                    </div>
                </div>
            </div>
        </>
    )
}


export function CreateMaterialForm({setScreen, setMaterials}) {
    const [error, setError] = useState({msg: ''});
    const {activeUser} = useContext(Context);
    const [action, setAction] = useState({creating: false});
    const closeScreen = () => {
        let ele = document.getElementById('create-material');
        ele.style.transition = "all 0.4s";
        ele.style.top = "100%";
        setTimeout(() => {
            setScreen({msg: ''})
        }, 400);
    }
    useEffect(() => {
        let ele = document.getElementById('create-material');
        ele.style.transition = "all 0.4s";
        ele.style.top = "100%";
        setTimeout(() => {
            ele.style.top = "0";
        }, 10);
    }, []);
    const createNewMaterial = async (e) => {
        e.preventDefault();
        setError({msg: ''})
        setAction({creating: true});
        const {res, data} = await createMaterial({name: e.target.name.value, desc: e.target.desc.value});
        if (res.ok) {
            setScreen({msg: '', data: ''});
            setMaterials(data);
        } else {
            setError({msg: data.msg});
        }
        setAction({creating: false});
    }
    return (
        <>
            <div id={'create-material'} className={'create-material'}>
                <div className={'create-material-outer'}>
                    {action.creating && <LinearProgress
                        sx={{position: "absolute", inset: "0 0 0 0", height: "2px", background: "transparent"}}/>}
                    <div className={'create-material-heading'}>
                        <span>Create a new material.</span>
                    </div>
                    <form onSubmit={createNewMaterial}>
                        <div className={'create-material-body'}>
                            <div className={'create-material-name'}>
                                <div className={'create-material-owner'}>
                                    <p>Owner</p>
                                    <div>
                                        <img src={activeUser.profilePic} width={'30px'}></img>
                                        <p style={{width:"8rem"}}>{activeUser && activeUser.name && activeUser.name.substring(0,15)}</p>
                                    </div>
                                </div>
                                <div style={{fontSize: "1.7rem", marginTop: "1.3rem"}}>/</div>
                                <div className={'create-material-input'}>
                                    <p>Material name</p>
                                    <div>
                                        <input autoComplete={'off'} minLength={4} maxLength={50} required={true} name={'name'}/>
                                    </div>
                                </div>
                            </div>
                            <div className={'create-material-desc'}>
                                <textarea required={true} minLength={10} maxLength={350} name={'desc'}></textarea>
                            </div>
                            <div className={'create-material-button'}>
                                <button disabled={action.creating} className={'close-btn'} type={'button'}
                                        onClick={closeScreen}>Close
                                </button>
                                {action.creating ?
                                    <button disabled={true}>
                                        <CustomCircularProgress precentage={70} trackColor={'transparent'} progressColor={'black'}/>
                                    </button>
                                    :
                                    <button disabled={action.creating} type={'submit'}>Create</button>
                                }
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export function CustomCircularProgress({color = 'primary',progressSize = '20px',thickness = 2,variant = 'soft',
    size = 'sm',trackThickness = 2,progressColor = 'white',trackColor = 'black',precentage=25})
{
    return (
        <CircularProgress
            style={{
                '--CircularProgress-percent':precentage,
                '--CircularProgress-size': progressSize,
                '--_track-thickness': `${trackThickness}px`,
                '--CircularProgress-trackColor': trackColor,
                '--CircularProgress-progressColor': progressColor
            }} thickness={thickness} size={size} variant={variant} color={color}
        />
    );
}

export function GetMaterialForm({setScreen, setMaterials}) {
    const [error, setError] = useState({msg: '', field: ''})
    const [code, setCode] = useState('');
    const [action, setAction] = useState({fetching: false});
    const navigate = useNavigate();
    const codeChange = (e) => {
        setCode(e.target.value);
        if (error.msg.length > 0 && error.field === 'code') {
            setError({msg: '', field: ''});
        }
    }
    const closeScreen = () => {
        let ele = document.getElementById('get-material');
        ele.style.transition = "all 0.4s";
        ele.style.top = "100%";
        setTimeout(() => {
            setScreen({msg: ''})
        }, 400);
    }
    useEffect(() => {
        let ele = document.getElementById('get-material');
        ele.style.transition = "all 0.4s";
        ele.style.top = "100%";
        setTimeout(() => {
            ele.style.top = "0";
        }, 10);
    }, []);
    const joinMaterial = async (e) => {
        setError({msg: '', field: ''})
        setAction({fetching: true});
        const digits = /\d/g, upperCase = /[A-Z]/
        if (digits.test(code) || upperCase.test(code) || code.length !== 8) {
            setError({msg: "code should contains 8-digit lowercase english letters only.", field: "code"})
        } else {
            const {res, data} = await joinMaterialRequest(code);
            if (res.ok) {
                closeScreen();
                setMaterials(data);
            } else {
                setError({msg: data.msg, field: data.field});
            }
        }
        setAction({fetching: false});
    }
    return (
        <>
            <div id={'get-material'} className={'get-material'}>
                <div className={'get-material-outer'}>
                    {action.fetching && <LinearProgress
                        sx={{position: "absolute", inset: "0 0 0 0", height: "2px", background: "transparent"}}/>}
                    <div className={'get-material-heading'}>
                        <span>Get meaterial via code</span>
                    </div>
                    <div className={'get-material-body'}>
                        <div>
                            <p>Enter a 8-digit unique material code</p>
                        </div>
                        <div>
                            <input id={'code'} autoComplete={'off'} required={true} onChange={codeChange}/>
                            {error.msg.length > 0 && error.field === 'code' &&
                                <p className={'error-msg'}>{error.msg}</p>}
                        </div>
                        <div className={'get-material-buttons'}>
                            <button className={'close-btn'} disabled={action.fetching} onClick={closeScreen}>Close</button>
                            {action.fetching ?  <button disabled={true}>
                                <CustomCircularProgress precentage={70} trackColor={'transparent'} progressColor={'black'}/>
                            </button>:
                            <button disabled={action.fetching} onClick={joinMaterial}>Find</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function Comment({comment}) {
    return (
        <>
            <div className={'comment-outer'}>
                <div className={'comment-heading'}>
                    <div className={'comment-user'}>
                        <img src={comment.profilePic} width={'30px'}></img>
                        <p>{comment.by.name}</p>
                        {/*<p>{'Kapilbhaigohil'}</p>*/}
                        {/*<div>{comment.updatedAt}</div>*/}
                    </div>
                </div>
                <div className={'comment-body'}>
                    <div className={'comment-desc'}>
                        <p>{comment.comment}</p>
                    </div>
                    <div className={'comment-info'}>
                        <div>
                            <ThumbUpOutlined/>
                            <div style={{height: "1.6rem"}}>{comment.likes}</div>
                        </div>
                        <div>
                            <ThumbDownOutlined/>
                            <div style={{height: "1.6rem"}}>{comment.disLikes}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function CommentScreen({setScreen, screen, commentOnClick}) {
    const [comments, setComments] = useState([]);
    const [msg, setMsg] = useState('');
    const last = useRef();
    const navigate = useNavigate();
    useEffect(() => {
        async function helper() {
            const {res, data} = await getComments(screen.data.material._id);
            if (res.ok) {
                setComments(data);
            }
        }

        helper();
    }, [screen]);
    const closeScreen = () => {
        let ele = document.getElementById('comment-screen');
        ele.style.transition = "all 0.4s";
        ele.style.top = "100%";
        setTimeout(() => {
            setScreen({msg: ''})
        }, 400);
    }
    useEffect(() => {
        let ele = document.getElementById('comment-screen');
        const temp = last.current;
        ele.style.transition = "all 0.4s";
        setTimeout(() => {
            ele.style.top = "0";
            setTimeout(() => {
                temp.scrollIntoView({behavior: 'smooth'}); // You might want to use 'smooth' behavior for a smooth scroll
            }, 400);
        }, 10);
    }, [screen]);
    const msgChange = (e) => {
        setMsg(e.target.value);
    }
    const msgSend = async (e) => {
        const {res, data} = await commentMaterial(screen.data.material._id, msg);
        if (res.ok) {
            let temp = {material: data, role: screen.data.role, _id: screen.data._id};
            screen.updateMaterial(temp, screen.index);
            commentOnClick(temp, screen.index);
            setMsg('');
        } else {
            navigate('/home');
        }
    }
    return (
        <>
            <div id={'comment-screen'} className={'comment-screen'}>
                <div className={'comment-screen-outer'}>
                    <div className={'comment-screen-heading'}>
                        <div> Computer science</div>
                        <div><CloseOutlined onClick={closeScreen}/></div>
                    </div>
                    <div className={'comment-screen-msg'}>
                        {comments.length > 0 ? comments.map((c, i) => <Comment key={i} comment={c}/>) :
                            <div className={'comment-screen-nomsg'}>
                                <AnnouncementIcon/>
                                <span>No comment till now.</span>
                            </div>
                        }
                        <div ref={last}></div>
                    </div>
                    <div className={'comment-screen-input'}>
                        <div className={'comment-screen-input-emoji'}><SentimentSatisfiedOutlined/></div>
                        <div className={'comment-screen-input-input'}><input onChange={msgChange} value={msg}
                                                                             placeholder={'write your comment here...'}/>
                        </div>
                        <div className={'comment-screen-input-button'}>
                            <button disabled={msg.length <= 0} onClick={msgSend}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
