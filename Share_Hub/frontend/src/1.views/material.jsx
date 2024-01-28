import {useNavigate, useParams} from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import "../3.styles/material.scss"
import {FileInfo, FileStructure, FolderInfo, FolderStructure, Path} from "../2.components/material/component";
import {getFilesList, getMaterialById} from "../2.components/material/fetchRequest";
import {useEffect, useState} from "react";
export default function Material(){
    const [material,setMaterial] = useState({});
    const [pathArray,setPathArray] = useState([]);
    const [allFiles,setAllFiles] = useState({})
    const [files,setFiles] = useState({files:[],folders:[]});
    const navigate = useNavigate();
    const {id} = useParams();
    useEffect(() => {
        async function func(){
            let {res,data} = await getMaterialById(id);
            if(res.ok){
                setMaterial(data);
            }else{
                navigate('/home');
            }
        }
        func();
    }, []);
    useEffect(() => {
        async function func(){
            if(material._id){
                let path = material._id
                if(pathArray.length>0){
                    let tempStr= pathArray.join("/");
                    path+="/"+tempStr;
                }
                let temp = {...allFiles},item = temp;
                for (let i = 0; i < pathArray.length; i++) {
                    item = item.folders;
                }
                const {res,data} = await getFilesList(path);
                if(res.ok){
                    setFiles({files:data.files,folders:data.folders})
                    item.files = data.files;
                    item.folders = data.folders;
                    setAllFiles(temp);
                }else{
                    navigate('/home')
                }
            }
        }
        func();
    }, [material,pathArray]);
    return(
        <>
            <div className={'material-outer'}>
                <div className={'material-structure'}>
                    <div className={'material-structure-search'}>
                        <SearchIcon/>
                        <input placeholder={'Go to file....'}/>
                    </div>
                    <div className={'material-structure-info'}>
                        <FolderStructure allFiles={allFiles} setPathArray={setPathArray} setAllFiles={setAllFiles} folder={material.name} prefix={''} depth={0} materialId={material._id}/>
                    </div>
                </div>
                <div className={'material-screen'}>
                    <div className={'material-screen-path'}>
                       <Path material={material} setPathArray={setPathArray} pathArray={pathArray}></Path>
                    </div>
                    <div className={'material-screen-info'}>
                        <div className={'material-screen-heading'}>
                            <span>Name</span>
                        </div>
                        {pathArray.length>0 && <FolderInfo folder={'. .'} setPathArray={setPathArray}/>}
                        {files.folders.map((folder,i)=><FolderInfo key={i} folder={folder} setPathArray={setPathArray}/>)}
                        {files.files.map((file,i)=><FileInfo key={i} file={file}/>)}
                    </div>
                </div>
            </div>
        </>
    )
}
