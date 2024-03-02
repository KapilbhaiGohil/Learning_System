import {useEffect, useState} from "react";
import "../../3.styles/home-1.scss"
import {ArrowDropDown, CloseOutlined} from "@mui/icons-material";
import {CustomCircularProgress} from "./components";
import {searchUserByEmail, sendInvitationReq} from "./fetchRequest-1";
import {$blueColor} from "../globle";
export  function  ShareScreen({setScreen,screen}){
    const [material,setMaterial] = useState({});
    const [action,setAction] = useState({sharing:false});
    const [peoples,setPeoples] = useState([]);
    const [error,setError] = useState({msg:'',field:''});
    useEffect(() => {
        setMaterial(screen.data.material);
    }, [screen.data.material]);
    useEffect(() => {
        let ele = document.getElementById('share-screen');
        ele.style.transition = "all 200ms ease";
        ele.style.scale = 0;
        setTimeout(() => {
            ele.style.scale = 1;
        }, 10);
    }, []);
    const closeShareScreen=(e)=>{
        let ele = document.getElementById('share-screen');
        ele.style.transition = "all 200ms ease";
        ele.style.scale = 0;
        setTimeout(() => {
            setScreen({msg:'home',data:{}});
        }, 400);
    }
    const removePeople=(index)=>{
        const temp = [...peoples];
        temp.splice(index,1);
        setPeoples(temp);
    }
    const shareMaterialClick=async(e)=>{
        if(peoples.length===0)setError({msg:'For sharing material at least one user must be selected.'});
        setError({msg:'',field: ''})
        setAction({sharing: true})
        const {res,data} = await sendInvitationReq(peoples,material._id);
        setAction({sharing: false});
        if(res.ok){
            closeShareScreen();
            window.alert(data.msg);
        }else {
            console.log(data);
            setError({msg:data.msg,field: ''})
        }
    }
    return(
        <>
            <div className={'share-screen'} id={'share-screen'}>
                <div className={'share-outer'}>
                    <div className={'share-heading'}>
                        <h3>Share Material</h3>
                        <CloseOutlined onClick={closeShareScreen}/>
                    </div>
                    <div className={'share-info'}>
                        <div className={'share-code'}>
                            <p>Material code : <span>{material.code}</span></p>
                            <p>You can ask others to enter this code in their get material section to access this material.<br/>
                                Note that the people joined using the code have Viewer level access to material
                            </p>
                            <p></p>
                        </div>
                        <div className={'share-devider'}>
                            <p>OR</p>
                        </div>
                        <div className={'share-people'}>
                            <div className={'share-input'}>
                                <div className={'share-input-box'}>
                                    <ShareCustomInput setError={setError} material={material} peoples={peoples} setPeoples={setPeoples}/>
                                </div>
                                {error.msg.length>0 && <p className={'error-msg'}>{error.msg}</p>}
                                <div className={'share-input-peoples'}>
                                    <div className={'share-input-peoples-first'}>
                                        <span>User</span>
                                        <span>Access Level</span>
                                    </div>
                                        {peoples.length>0 &&
                                            peoples.map((p,i)=>
                                                <div key={i} className={'share-input-peoples-list hover-class'}>
                                                    <People user={p} hover={false}/>
                                                    <span style={{marginRight:'0.4rem'}}>{p.access}</span>
                                                    <CloseOutlined style={{marginRight:'0.4rem'}} onClick={(e)=>removePeople(i)}/>
                                                </div>)
                                        }
                                </div>
                            </div>
                            <div className={'share-button'}>
                                {action.sharing ?
                                    <button disabled={true}>
                                        <CustomCircularProgress precentage={70} trackColor={'transparent'} progressColor={'black'}/>
                                    </button>
                                    :
                                    <button disabled={peoples.length===0} onClick={shareMaterialClick}>Share</button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
function ShareCustomInput({setPeoples,peoples,material,setError}){
    const [role,setRole] = useState('Viewer');
    const roles =['Viewer','Editor','Collaborator'];
    const [expanded,setExpanded] = useState(false);
    const [search,setSearch] = useState('');
    const [users,setUsers] = useState({selectedUser:undefined,allUser:[]});
    const [action,setAction] = useState({fetching:false});
    useEffect(() => {
        async function helper(){
            setError({msg:'',field: ''})
            setUsers({...users,['allUser']:[]});
            setAction({fetching: true})
            let {res,data} = await searchUserByEmail(search,material._id);
            if(res.ok){
                for (let i = 0; i < peoples.length; i++) {
                    data = data.filter((u)=>u.email!==peoples[i].email);
                }
                setUsers({...users,['allUser']:data});
                if(data.length ===0){
                    setError({msg: `No user found with email : ${search}... or the material is already shared to the user.`,field: 'search'})
                }
            }else{
                setError({msg: data.msg,field: 'error'});
            }
            setAction({fetching: false});
        }
        if(search.length>=4){
            const timer = setTimeout(()=>{
                helper();
            },500);
            return (()=>{
                clearTimeout(timer);
            })
        }else{
            setUsers({selectedUser: undefined,allUser: []})
        }
    }, [search]);
    const addPerson=(e,user)=>{
        setUsers({selectedUser:user,allUser: []});
    }
    const removeUserFromInput=(e)=>{
        setSearch('')
        setUsers({selectedUser:undefined,allUser: [] });
    }
    const addPeopelToList=(e)=>{
        if(!users.selectedUser){
            setError({msg: 'Before adding user pls make sure it is selected.',field: ''})
        }else{
            setPeoples(prev=>[...prev,{...users.selectedUser,access:role}]);
            setSearch('');
            setUsers({...users,selectedUser: undefined});
        }
    }
    return(
        <>
            <div className={'share-custom-outer'}>
                <div className={'share-custom'}>
                    <div className={'share-custom-input'}>
                        <input id={'searchEmail'} value={search} autoComplete={'off'} disabled={users.selectedUser} onChange={(e)=>{setSearch(e.target.value);setError({msg: '',field: ''})}} placeholder={!users.selectedUser && 'Enter first four letters of email'}/>
                        <div onClick={()=>{setExpanded(!expanded)}} className={'share-static'}>
                            <ArrowDropDown/>
                            <span>{role}</span>
                        </div>
                        {(users.allUser.length > 0 || action.fetching) &&
                            <div className={'search-result'}>
                                {action.fetching && <CustomCircularProgress precentage={70} trackColor={'transparent'} progressColor={$blueColor} />}
                                {users.allUser.map((u,i)=><People onClick={addPerson}  key={i} user={u}/>)}
                            </div>
                        }
                        {users.selectedUser && <div className={'input-people'}>
                            <img src={users.selectedUser.profilePic}/>
                            <span>{users.selectedUser.email}</span>
                            <CloseOutlined onClick={removeUserFromInput}/>
                        </div>}
                        {expanded && <div className={'share-right-options'}>
                            <ul>
                                {roles.map(r => r !== role && <li onClick={(e)=>{setRole(r);setExpanded(false)}}>{r}</li>)}
                            </ul>
                        </div>}
                    </div>
                </div>
                <div className={'share-add-button'}>
                    <button disabled={!users.selectedUser} onClick={addPeopelToList}>Add</button>
                </div>
            </div>
        </>
    )
}
function People({user,onClick,hover=true}){
    if(!onClick)onClick=()=>{};
    return(
        <>
            <div onClick={(e)=>onClick(e,user)} style={!hover ? {cursor:'unset'}:{}} className={`share-search-outer ${hover ? 'hover-class' : ''}`}>
                <div className={'share-search-pic'}>
                    <img src={user.profilePic} width={'20px'} alt={'profile photo'}/>
                </div>
                <div className={'share-search-info'}>
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                </div>
            </div>

        </>
    )
}