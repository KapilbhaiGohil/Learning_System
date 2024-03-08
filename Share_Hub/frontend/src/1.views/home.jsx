import {CommentScreen, CreateMaterialForm, GetMaterialForm, MaterialCard} from '../2.components/home/components'
import '../3.styles/globle.scss'
import '../3.styles/home.scss'
import {useContext, useEffect, useRef, useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import {getMaterials, joinMaterialRequest} from "../2.components/home/fetchRequest";
import LoadingBar from "react-top-loading-bar";
import {ShareScreen} from "../2.components/home/components-1";
import noDataFound from '../5.assets/no data found.jpg'
import {Context} from "../Context";
import noMaterialSvg from '../5.assets/noMaterial.svg'
import {ArrowDropDown, Block, CreateNewFolder, KeyboardArrowDown, Public} from "@mui/icons-material";
import {Tooltip} from "@mui/material";
import {Select, Option,selectClasses} from "@mui/joy";
export default function Home(){
    const [materials,setMaterials] = useState([]);
    const [filteredMaterials,setFilteredMaterials] = useState([]);
    const [error,setError] = useState({msg:''});
    const [screen,setScreen] = useState({msg:""});
    const [progress,setProgress] = useState(0);
    const [search,setSearch] = useState({query:'',level:'Any',applyFilter:false});
    const {refresh} = useContext(Context)
    useEffect(() => {
        const temp = [];
        const arr = materials;
        if(search.query.length>0 || search.level!=='Any'){
            for (let i = 0; i < arr.length; i++) {
                let tempMaterial = arr[i].material;
                if (
                    (search.query.length > 0 && search.level !== 'Any' && tempMaterial.name.toLowerCase().includes(search.query) && arr[i].role === search.level) ||
                    (search.query.length > 0 && tempMaterial.name.toLowerCase().includes(search.query) && search.level==='Any') ||
                    (search.level!=='Any' && search.query.length===0 &&arr[i].role === search.level)
                ) {
                    console.log(i);
                    console.log((search.query.length > 0 && search.level !== 'Any' && tempMaterial.name.toLowerCase().includes(search.query) && arr[i].role === search.level) )
                    console.log((search.query.length > 0 && tempMaterial.name.toLowerCase().includes(search.query)))
                    console.log(   (arr[i].role === search.level))
                    temp.push(arr[i]);
                }
            }
            setFilteredMaterials(temp);
            setSearch({...search,applyFilter: true});
        }else{
            setSearch({...search,applyFilter: false});
        }
    }, [search.level,search.query,materials]);
    const onSearchChange = (e)=>{
        let q = e.target.value.trim().toLowerCase();
        setSearch({...search,query: q});
    }
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
    },[refresh])
    const commentOnclick=(materialObj,index)=>{
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
        setMaterials((prev)=>{return temp;});
    }
    const shareOnClick=(e,material)=>{
        setScreen({msg:'shareScreen',data:{material}});
    }
    return (
        <>
            <LoadingBar color={'#2f81f7'} progress={progress} onLoaderFinished={() => setProgress(0)} />
            <div className={'home-outer'}>
                <div className={'home-search'}>
                    <div className={'home-search-input'}>
                        <SearchIcon/>
                        <input onChange={onSearchChange} placeholder={'Search your materials here....'}/>
                    </div>
                    <div className={'home-search-filters'}>
                        <DropDown options={['Any','Viewer','Editor','Collaborator','Owner']} onChange={(level)=>{setSearch({...search,level: level})}}/>
                    </div>
                    <Tooltip title={'Create material'} arrow>
                        <div onClick={createMaterialClick} className={'home-search-icons'}>
                            <CreateNewFolder />
                        </div>
                    </Tooltip>
                    <Tooltip title={'Get material via code'} arrow>
                        <div onClick={getMaterialClick} className={'home-search-icons'}>
                            <Public />
                        </div>
                    </Tooltip>
                </div>
                <div className={'home-materials'}>
                    {search.applyFilter ?
                        (filteredMaterials.length > 0 ?
                                filteredMaterials.map((m,i)=><MaterialCard key={m._id} setProgress={setProgress} setMaterials={setMaterials} shareOnClick={shareOnClick} index={i} updateMaterial={updateMaterial} commentOnclick={commentOnclick} setScreen={setScreen} materialObj={m}/>)
                                :
                                <>
                                    <div className={'home-materials-nomaterials'}>
                                        <div>
                                            <img src={noMaterialSvg} alt={'not found'} />
                                            <div>No material found</div>
                                        </div>
                                    </div>
                                </>
                        )
                        :
                        (
                            materials.length > 0 ? materials.map((m,i)=><MaterialCard key={m._id} setProgress={setProgress} setMaterials={setMaterials} shareOnClick={shareOnClick} index={i} updateMaterial={updateMaterial} commentOnclick={commentOnclick} setScreen={setScreen} materialObj={m}/>):
                                <>
                                    <div className={'home-materials-nomaterials'}>
                                        <div>
                                            <img src={noMaterialSvg} alt={'not found'} />
                                            <div>No material found</div>
                                        </div>
                                    </div>
                                </>
                        )
                    }
                </div>
                {/*<div className={'home-buttons'}>*/}
                {/*    <div><button onClick={createMaterialClick}>Create material</button></div>*/}
                {/*    <div><button onClick={getMaterialClick}>Get material</button></div>*/}
                {/*</div>*/}
                <div className={'home-screens'}>
                    {screen.msg==='comment' && <CommentScreen commentOnClick={commentOnclick} screen={screen} setScreen={setScreen}/>}
                    {screen.msg==='createMaterial' && <CreateMaterialForm setMaterials={setMaterials} setScreen={setScreen}/>}
                    {screen.msg==='getMaterial' && <GetMaterialForm setMaterials={setMaterials} setScreen={setScreen}/>}
                    {screen.msg==='shareScreen' && <ShareScreen setScreen={setScreen} screen={screen}/>}
                </div>
            </div>

        </>
    )
}
export function DropDown({options,onChange}){
    const [selected,setSelected] = useState(options[0]);
    const [see,setSee] = useState(false);
    const iconRef = useRef();
    const selectOption =(e,val)=>{
        setSee(false);
        setSelected(val);
        if(onChange)onChange(val);
    }
    return(
        <>
            <div className={'dropdown'}>
                <div onClick={(e)=>setSee(!see)} className={'dropdown-main'}>
                    <span>{selected.substring(0,6)}{selected.length>6 && '...'}</span>
                    <ArrowDropDown className={see ? 'revert-icon':''} ref={iconRef} style={{rotate:"(180deg)"}}/>
                </div>
                {see &&
                    <div className={'dropdown-options'}>
                        {options.map((o,i)=>
                            <div key={i} onClick={(e)=>selectOption(e,o)} className={'dropdown-option'}>
                                <span>{o}</span>
                            </div>
                        )}
                    </div>
                }

            </div>
        </>
    )
}