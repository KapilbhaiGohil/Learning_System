import {useNavigate, useParams} from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import "../3.styles/material.scss"
import {FileInfo, FileStructure, FolderInfo, FolderStructure, Path} from "../2.components/material/component";
import {getFilesList, getMaterialById, getPathAsString} from "../2.components/material/fetchRequest";
import {useEffect, useState} from "react";
import FileViewer from "../2.components/material/FileViewer";
export default function Material(){
    const [material,setMaterial] = useState({});
    const [pathArray,setPathArray] = useState([]);
    const [allFiles,setAllFiles] = useState({})
    const [files,setFiles] = useState({files:[],folders:[]});
    const [isFileScreen,setIsFileScreen] = useState({isFile:false,file:''});
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        async function func(){
            let {res,data} = await getMaterialById(id);
            if(res.ok){
                setMaterial(data);
                setPathArray([{name:data.name,type:'folder'}]);
            }else{
                navigate('/home');
            }
        }
        func();
    }, []);
    useEffect(() => {
        async function func(){
            if(material._id && pathArray[pathArray.length-1].type==='folder'){
                let path = material._id
                if(pathArray.length>1){
                    path+="/"+ getPathAsString(pathArray,1);
                }
                let temp = {...allFiles},item = temp;
                for (let i = 0; i < pathArray.length-1; i++) {
                    for (let j = 0; j < item.folders.length; j++) {
                        console.log(item,i,j,item.folders[j].name,pathArray)
                        if(item.folders[j].name===pathArray[i+1].name){
                            item = item.folders[j];
                            break;
                        }
                    }
                }
                const {res,data} = await getFilesList(path);
                if(res.ok){
                    setFiles({files:data.files,folders:data.folders})
                    item.name = pathArray[pathArray.length-1].name
                    item.files = data.files
                    item.folders = data.folders
                    setAllFiles(temp);
                }else{
                    navigate('/home')
                }
            }
        }
        func();
    }, [material,pathArray]);

    const showFile=(e,file,fromStructure=false,prefix=undefined)=>{
        setIsFileScreen({isFile: true,file});
        let temp = [];
        console.log(prefix,pathArray);
        if(fromStructure){
            if(prefix)temp = [pathArray[0],...prefix.split('/').map((name)=>{return {name:name,type:'folder'}})];
            else temp = [pathArray[0]]
        }else{
            for (let i = 0; i < pathArray.length; i++) {
                if(pathArray[i].type==='file'){
                    break;
                }else{
                    temp.push(pathArray[i])
                }
            }
        }
        setPathArray([...temp,{name:file.name,type:'file'}]);
    }
    return(
        <>
            <div className={'material-outer'}>
                <div className={'material-structure'}>
                    <div className={'material-structure-search'}>
                        <SearchIcon/>
                        <input placeholder={'Go to file....'}/>
                    </div>
                    <div className={'material-structure-info'}>
                        {allFiles.folders && <FolderStructure pathArray={pathArray} allFiles={allFiles} setPathArray={setPathArray}
                                          setAllFiles={setAllFiles} showFile={showFile} folder={{name:material.name}} prefix={''} depth={0}
                                          material={material}/>}
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
                        {pathArray.length > 1 && pathArray[pathArray.length-1].type==='folder' && <FolderInfo folder={{name:'. .',type:'folder'}} setPathArray={setPathArray}/>}
                        {!isFileScreen.isFile && files.folders.map((folder,i)=><FolderInfo key={i}  folder={folder} setPathArray={setPathArray}/>)}
                        {!isFileScreen.isFile && files.files.map((file,i)=><FileInfo showFile={showFile} key={i}  file={file}/>)}
                        {isFileScreen.isFile &&
                            <FileViewer pathArray={pathArray} file={isFileScreen.file} setIsFileScreen={setIsFileScreen}/>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
