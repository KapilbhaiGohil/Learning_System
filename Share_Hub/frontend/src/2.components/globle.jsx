import "../3.styles/globle.scss"
import logo from "../5.assets/finalLogo.png"
import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Context} from "../Context";
export function Navbar(){
    const [create,setCreate] = useState(false);
    const getMaterial=()=>{

    }
    const createMaterial=()=>{
        setCreate(true);
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
                        {/*<li onClick={getMaterial}>Get Material</li>*/}
                        {/*<li onClick={createMaterial}>Create Material</li>*/}
                    </ul>
                </div>
            </nav>
            {create && <CreateMaterial setCreate={setCreate} />}
        </>
    )
}

export function CreateMaterial({setCreate}){
    const {refresh,setRefresh} = useContext(Context);
    const [data,setData] = useState({name:"",desc:""})
    const [error,setError] = useState({msg:''});
    const navigate = useNavigate()
    const closeFunc=(e)=>{
        if(e.target.id==='create' || e.target.id==='closebtn')setCreate(false);
    }
    const setInput = (e)=>{
        setData({
            ...data,[e.target.name]:e.target.value
        });
    }
    const formSubmit=async(e)=>{
        e.preventDefault();
        setError({msg:''});
        try{
            const file = e.target.backImg.files[0];
            console.log(file);
            const formData = new FormData();
            formData.append('name',data.name);
            formData.append('desc',data.desc);
            formData.append('backImg',file);
            console.log(formData)
            const res = await fetch('material/create',{
                method:"post",
                headers:{
                    'contentType':"multipart/form-data"
                },
                body:formData
            });
            if(res.ok){
                setCreate(false);
                setRefresh(!refresh);
            }else{
                const d = await res.json();
                setError({msg:d.msg});
            }
        }catch (e) {
            console.log(e)
            setError({msg:e.toString()})
        }
    }
    return(
        <>
            <form method={'post'} onSubmit={formSubmit}>
                <div className={'create'} id={'create'} onClick={closeFunc}>
                    <div className={'create-outer'}>
                        <span>Create Material</span>
                        {error.msg.length>0 && <p style={{color: "#e80000",marginTop: "1rem",fontSize: "0.9rem"}}>{error.msg}</p>}
                        <div>
                            <Input label={'Name (required)'} autoComplete={'off'} name={'name'} onChange={setInput}/>
                        </div>
                        <div>
                            <Input label={'Description'} autoComplete={'off'} name={'desc'} onChange={setInput}/>
                        </div>
                        <div>
                            <span>Background Image : </span>
                            <input type={'file'} accept={'image/*'} name={'backImg'}/>
                        </div>
                        <div className={'create-buttons'}>
                            <button id={'closebtn'} onClick={closeFunc} style={{background:"#848484"}}>Cancel</button>
                            <button style={{background:"rgb(7 101 168)",color:"white"}} type={'submit'}>Create</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}
export function Input({label,onChange,autoComplete,name}){
    const [applyCss,setApplyCss] = useState(false);
    const handleInput=(e)=>{
        if(e.target.value.length!==0){
            setApplyCss(true);
        }else{
            setApplyCss(false);
        }
        onChange(e);
    }
    let materialLabelStyle= {
        top: "0.2rem",
        color: "rgb(25,103,210)",
        fontSize: "0.8rem"
    }
    let materialInputStyle = {
        borderBottomColor:"rgb(25,103,210)"
    }
    return(
        <>
            <div  style={ applyCss ? materialInputStyle:{}} className={'material-input'}>
                <div style={ applyCss ? materialLabelStyle:{}} className={'material-input-label'}>
                    <span>{label}</span>
                </div>
                <div className={'material-input-input'}>
                    <input autoComplete={autoComplete} name={name} onChange={handleInput} />
                </div>
            </div>
        </>
    )
}