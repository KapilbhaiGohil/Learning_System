import {CommentScreen, CreateMaterialForm, GetMaterialForm, MaterialCard} from '../2.components/home/components'
import '../3.styles/globle.scss'
import '../3.styles/home.scss'
import {useEffect, useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import {useNavigate} from "react-router-dom";
import {getMaterials} from "../2.components/home/fetchRequest";
import {Skeleton} from "@mui/material";
import LoadingBar from "react-top-loading-bar";

export default function Home(){
    const [materials,setMaterials] = useState([]);
    const [error,setError] = useState({msg:''});
    const [screen,setScreen] = useState({msg:""});
    const [progress,setProgress] = useState(0);
    const navigate = useNavigate();

    //material fetching
    useEffect(()=>{
        async function func(){
            setProgress(30);
            const {res,data} = await getMaterials(setMaterials,setError)
            if(res.ok){
                setMaterials(data);
            }else{
                if(data.field==='token'){
                    window.location.replace('http://localhost:3001/auth');
                }
                setError({msg:data.msg});
            }
            setProgress(100);
        }
        func();
    },[])
    const commentOnclick=(materialObj,index)=>{
        console.log(materialObj)
        setScreen({msg:"comment",data:materialObj,index,updateMaterial});
    }
    const getMaterialClick=()=>{
        setScreen({msg:'getMaterial',data:""});
    }
    const createMaterialClick=()=>{
        setScreen({msg:'createMaterial',data:{}});
    }
    const updateMaterial=(materialObj,index)=>{
        let temp = [...materials];
        temp.splice(index,1,materialObj);
        console.log("updated",temp)
        setMaterials((prev)=>{return temp;});
    }
    return (
        <>
            <LoadingBar color={'#2f81f7'} progress={progress} onLoaderFinished={() => setProgress(0)} />
            <div className={'home-outer'}>
                <div className={'home-search'}>
                    <div className={'home-search-input'}>
                        <SearchIcon/>
                        <input placeholder={'Search your materials here....'}/>
                    </div>
                </div>
                <div className={'home-materials'}>
                    {/*<Skeleton variant="rectangular" className={'material-card-outer'} width={'29.9rem'} height={'11rem'}/>*/}
                    {materials.length>0 ? materials.map((m,i)=><MaterialCard key={m._id} index={i} updateMaterial={updateMaterial} commentOnclick={commentOnclick} setScreen={setScreen} materialObj={m}/>):
                        <>
                            <div>
                            <div>No material found</div>
                            <div>You can create a new one</div>
                            </div>
                        </>}
                </div>
                <div className={'home-buttons'}>
                    <div><button onClick={createMaterialClick}>Create material</button></div>
                    <div><button onClick={getMaterialClick}>Get material</button></div>
                </div>
                <div className={'home-screens'}>
                    {screen.msg==='comment' && <CommentScreen commentOnClick={commentOnclick} screen={screen} setScreen={setScreen}/>}
                    {screen.msg==='createMaterial' && <CreateMaterialForm setMaterials={setMaterials} setScreen={setScreen}/>}
                    {screen.msg==='getMaterial' && <GetMaterialForm setMaterials={setMaterials} setScreen={setScreen}/>}
                </div>
            </div>

        </>
    )
}