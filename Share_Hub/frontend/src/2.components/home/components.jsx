import MoreVertIcon from '@mui/icons-material/MoreVert';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import logo from '../../5.assets/demo.jpg'
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
    CloseOutlined,
    SentimentSatisfiedOutlined,
    ThumbDownOutlined,
    ThumbUpOutlined
} from "@mui/icons-material";
import {createMaterial, likeMaterial, removeLikeMaterial} from "./fetchRequest";
import {useContext, useEffect, useRef, useState} from "react";
import {Context} from "../../Context";
import {useNavigate} from "react-router-dom";

export function MaterialCard({commentOnclick,updateMaterial,index,material}){
    const {activeUser} = useContext(Context);
    const [like,setLike]=useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        for (let i = 0; i < material.likes.length; i++) {
            if(activeUser && activeUser._id && material.likes[i]===activeUser._id.toString()){
                setLike(true);
                break;
            }
        }
    }, [activeUser]);
    const likeFunction=async (e) => {
        let res,data;
        if (like){
            ({res,data} = await removeLikeMaterial(material._id))
        }else{
            ({res,data} = await likeMaterial(material._id))
        }
        if(res.ok){
            updateMaterial(data,index);
            setLike(!like);
        }
    }
    const materialClick=(e)=>{
        navigate(`/material/${material._id}`);
    }
    return(
        <>
            <div className={'material-card-outer'}>
                <div className={'material-card-heading'}>
                    <div onClick={materialClick} className={'material-card-heading-name'}>
                        <span>{material.name}</span>
                    </div>
                    <div className={'material-card-heading-right'}>
                        <div className={'material-card-heading-right-info'}>
                            Owner
                        </div>
                        <div className={'material-card-heading-right-options'}>
                            <MoreVertIcon />
                        </div>
                    </div>
                </div>
                <div className={'material-card-desc'}>
                    <p>{material.desc}</p>
                </div>
                <div className={'material-card-options'}>
                    <div className={'material-card-options-right'}>
                        <div onClick={commentOnclick}>
                            <CommentOutlinedIcon/>
                            <span>235</span>
                        </div>
                        <div onClick={likeFunction}>
                            {like ? <FavoriteIcon style={{color:"red"}}/> : <FavoriteBorderOutlinedIcon /> }
                            <span>{material && material.likes && material.likes.length}</span>
                        </div>
                        <div>
                            <GroupsOutlinedIcon/>
                            <span>235</span>
                        </div>
                    </div>
                    <div className={'material-card-options-left'}><ReplyOutlinedIcon style={{transform: "scaleX(-1)"}}/></div>
                </div>
            </div>
        </>
    )
}


export function CreateMaterialForm({setScreen,setMaterials}){
    const [error,setError] = useState({msg:''});
    const closeScreen = ()=>{
        let ele = document.getElementById('create-material');
        ele.style.transition="all 0.4s";
        ele.style.top = "100%";
        setTimeout(()=>{setScreen({msg:''})},400);
    }
    useEffect(() => {
        let ele = document.getElementById('create-material');
        ele.style.transition="all 0.4s";
        ele.style.top="100%";
        setTimeout(()=>{ ele.style.top = "0";},10);
    }, []);
    const createNewMaterial = async(e)=>{
        e.preventDefault();
        console.log(e);
        const {res,data}=await createMaterial({name:e.target.name.value,desc:e.target.desc.value});
        if(res.ok){
            setScreen({msg:'',data:''});
            setMaterials(data.materials);
        }else{
            setError({msg:data.msg});
        }
    }
    return(
        <>
            <div id={'create-material'} className={'create-material'}>
                <div className={'create-material-outer'}>
                    <div className={'create-material-heading'}>
                        <span>Create a new material.</span>
                    </div>
                    <form onSubmit={createNewMaterial}>
                        <div className={'create-material-body'}>
                            <div className={'create-material-name'}>
                                <div className={'create-material-owner'}>
                                    <p>Owner</p>
                                    <div>
                                        <img src={logo} width={'30px'}></img>
                                        <p>Kapilbhaigohil</p>
                                    </div>

                                </div>
                                <div style={{fontSize:"1.7rem",marginTop:"1.3rem"}}>/</div>
                                <div className={'create-material-input'}>
                                    <p>Material name</p>
                                    <div>
                                        <input required={'true'} name={'name'}/>
                                    </div>
                                </div>
                            </div>
                            <div className={'create-material-desc'}>
                                <textarea required={true} name={'desc'}></textarea>
                            </div>
                            <div className={'create-material-button'}>
                                <button className={'close-btn'} type={'button'} onClick={closeScreen}>Close</button>
                                <button type={'submit'}>Create</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export function GetMaterialForm({setScreen}){
    const closeScreen = ()=>{
        let ele = document.getElementById('get-material');
        ele.style.transition="all 0.4s";
        ele.style.top = "100%";
        setTimeout(()=>{setScreen({msg:''})},400);
    }
    useEffect(() => {
        let ele = document.getElementById('get-material');
        ele.style.transition="all 0.4s";
        ele.style.top="100%";
        setTimeout(()=>{ ele.style.top = "0";},10);
    }, []);
    return(
        <>
            <div id={'get-material'} className={'get-material'}>
                <div className={'get-material-outer'}>
                    <div className={'get-material-heading'}>
                        <span>Get meaterial via code</span>
                    </div>
                    <div className={'get-material-body'}>
                        <div>
                            <p>Enter a material code</p>
                        </div>
                        <div>
                            <input/>
                        </div>
                        <div className={'get-material-buttons'}>
                            <button className={'close-btn'} onClick={closeScreen}>Close</button>
                            <button>Find</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function Comment({material}){
    return(
        <>
            <div className={'comment-outer'}>
                <div className={'comment-heading'}>
                    <div className={'comment-user'}>
                        <div><img src={logo} width={'30px'}></img></div>
                        <div>Kapilbhaigohil</div>
                        <div>2 minutes ago</div>
                    </div>
                </div>
                <div className={'comment-body'}>
                    <div className={'comment-desc'}>
                        <p>hello this should be illegeal due to the war.</p>
                    </div>
                    <div className={'comment-info'}>
                        <div>
                            <ThumbUpOutlined />
                            <div></div>
                        </div>
                        <div>
                            <ThumbDownOutlined/>
                            <div>20</div>
                        </div>
                        <div>
                            <CommentOutlinedIcon />
                            <div>Replay</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export function CommentScreen({setScreen}){
    const closeScreen = ()=>{
        let ele = document.getElementById('comment-screen');
        ele.style.transition="all 0.4s";
        ele.style.top = "100%";
        setTimeout(()=>{setScreen({msg:''})},400);
    }
    useEffect(() => {
        let ele = document.getElementById('comment-screen');
        ele.style.transition="all 0.4s";
        setTimeout(()=>{ ele.style.top = "0";},10);
    }, []);
    return(
        <>
            <div id={'comment-screen'} className={'comment-screen'}>
                <div  className={'comment-screen-outer'}>
                    <div className={'comment-screen-heading'}>
                        <div> Computer science </div>
                        <div><CloseOutlined onClick={closeScreen}/></div>
                    </div>
                    <div className={'comment-screen-msg'}>
                        <Comment/>
                        <Comment/>
                        <Comment/>
                        <Comment/>
                        <Comment/>
                    </div>
                    <div className={'comment-screen-input'}>
                        <div className={'comment-screen-input-emoji'}><SentimentSatisfiedOutlined/></div>
                        <div className={'comment-screen-input-input'}><input/></div>
                        <div className={'comment-screen-input-button'}><button>Send</button></div>
                    </div>
                </div>
            </div>
        </>
    )
}
