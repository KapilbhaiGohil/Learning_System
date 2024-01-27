import {CommentScreen, CreateMaterialForm, GetMaterialForm, MaterialCard} from '../2.components/home/components'
import '../3.styles/globle.scss'
import '../3.styles/home.scss'
import {useEffect, useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import {useNavigate} from "react-router-dom";
import {getMaterials} from "../2.components/home/fetchRequest";

export default function Home(){
    const [materials,setMaterials] = useState([]);
    const [error,setError] = useState({msg:''});
    const [screen,setScreen] = useState({msg:""});
    const navigate = useNavigate();

    //material fetching
    useEffect(()=>{
        async function func(){
            const {res,data} = await getMaterials(setMaterials,setError)
            if(res.ok){
                setMaterials(data);
            }else{
                if(data.field==='token'){
                    window.location.replace('http://localhost:3001/auth');
                }
                setError({msg:data.msg});
            }
        }
        func();
    },[])
    const commentOnclick=(material)=>{
        setScreen({msg:"comment",data:material});
    }
    const getMaterialClick=()=>{
        setScreen({msg:'getMaterial',data:""});
    }
    const createMaterialClick=()=>{
        setScreen({msg:'createMaterial',data:{}});
    }
    const updateMaterial=(material,index)=>{
        let temp = [...materials];
        temp.splice(index,1,material);
        console.log("updated",temp)
        setMaterials((prev)=>{return temp;});
    }
    return (
        <>
            <div className={'home-outer'}>
                <div className={'home-search'}>
                    <div className={'home-search-input'}>
                        <SearchIcon/>
                        <input placeholder={'Search your materials here....'}/>
                    </div>
                </div>
                <div className={'home-materials'}>
                    {materials.length>0 ? materials.map((m,i)=><MaterialCard key={m._id} index={i} updateMaterial={updateMaterial} commentOnclick={commentOnclick} setScreen={setScreen} material={m}/>):
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
                    {screen.msg==='comment' && <CommentScreen setScreen={setScreen}/>}
                    {screen.msg==='createMaterial' && <CreateMaterialForm setMaterials={setMaterials} setScreen={setScreen}/>}
                    {screen.msg==='getMaterial' && <GetMaterialForm setScreen={setScreen}/>}
                </div>
            </div>

        </>
    )
}