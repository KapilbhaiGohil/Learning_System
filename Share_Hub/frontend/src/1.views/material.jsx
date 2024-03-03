import {useNavigate, useParams} from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import "../3.styles/material.scss"
import {FileInfo, FileStructure, FolderInfo, FolderStructure, Path} from "../2.components/material/component";
import {
    deleteFiles,
    downloadFilesReq,
    getFilesList,
    getMaterialById,
    getPathAsString
} from "../2.components/material/fetchRequest";
import {useContext, useEffect, useState} from "react";
import FileViewer from "../2.components/material/FileViewer";
import LoadingBar from "react-top-loading-bar";
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import {Checkbox} from "@mui/material";
import {$blueColor, $borderColor, $lightBlue} from "../2.components/globle";
import {Context} from "../Context";
import {CircularProgress} from "@mui/joy";
import {CustomCircularProgress} from "../2.components/home/components";

export default function Material(){
    const [progress,setProgress] = useState(0);
    const [material,setMaterial] = useState({});
    const [pathArray,setPathArray] = useState([]);
    const [allFiles,setAllFiles] = useState({})
    const [files,setFiles] = useState({files:[],folders:[],total:0});
    const [noSelected,setNoSelected] = useState(0);
    const [checked,setChecked] = useState(false);
    const [isFileScreen,setIsFileScreen] = useState({isFile:false,file:''});
    const [action,setAction] = useState({downloading:false,deleting:false});
    const [rights,setRights] = useState();
    const navigate = useNavigate();
    const {id} = useParams();
    const {activeUser} = useContext(Context);

    useEffect(() => {
        async function func(){
            setProgress(20);
            let {res,data} = await getMaterialById(id);
            if(res.ok){
                setMaterial(data);
                setPathArray([{name:data.name,type:'folder'}]);
                setProgress(prevState => prevState+20);
            }else{
                navigate('/home');
            }
        }
        func();
    }, []);
    useEffect(() => {
        async function func(){
            if(material._id && pathArray[pathArray.length-1].type==='folder'){
                setProgress(prevState => prevState+30);
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
                const {res,data} = await getFilesList(path,material._id);
                if(res.ok){
                    let rem = data.files.length+data.folders.length;
                    if(data.files.findIndex(f=>f.name==='folder_storing_purpose.txt')>=0)rem--;
                    setFiles({files:data.files,folders:data.folders,total:rem})
                    setNoSelected(0);
                    item.name = pathArray[pathArray.length-1].name
                    item.files = data.files
                    item.folders = data.folders
                    setAllFiles(temp);
                    setProgress(100);
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
    const onSelection=(e)=>{
        let temp = {...files};
        if(checked){
            temp.files = temp.files.map(f=>{f.selected = false;return f;});
            temp.folders = temp.folders.map(f=>{f.selected = false;return f;});
        }else{
            temp.files = temp.files.map(f=>{f.selected = true;return f;});
            temp.folders = temp.folders.map(f=>{f.selected = true;return f;});
        }
        checked ? setNoSelected(0):setNoSelected(files.total);
        setChecked(!checked);
        setFiles(temp);
    }
    useEffect(() => {
        if(noSelected===files.total)setChecked(true);
        else setChecked(false);
    }, [noSelected===files.total]);
    const deleteFilesEvent=async (e)=>{
        const bool = window.confirm('Website is still in development phase. You can\'t retrieve the file once it is deleted. Are you sure to delete?');
        if(bool){
            setAction({...action,['deleting']: true});
            setProgress(30);
            let path = getPathAsString(pathArray,1);
            const failed1 = await deleteFiles(path,files.files,material._id,'file',setProgress,files.total)
            const failed2 = await deleteFiles(path,files.folders,material._id,'folder',setProgress,files.total)
            if(failed1.length + failed2.length!==0)window.alert(`${failed2.length+failed1.length} files not deleted due to internal error`)
            setAction({...action,['deleting']: false});
            setPathArray([...pathArray]);
        }
    }
    const downloadFilesEvent=async(e)=>{
        setAction({...action,['downloading']: true});
        let path = getPathAsString(pathArray,1);
        const selectedFiles = files.files.filter(f=>f.selected && f.name!=='folder_storing_purpose.txt');
        const selectedFolders = files.folders.filter(f=>f.selected);
        const ele = document.getElementById('zipFileName');
        let res,fileName = ele && ele.value.length>0 ? ele.value : 'UnknownStudyFiles.zip';
        if(selectedFiles.length===0 && selectedFolders.length===1){
            fileName = selectedFolders[0].name;
        }
        if(ele)ele.value = '';
        setProgress(prevState => prevState+30)
        if(selectedFiles.length===1 && selectedFolders.length===0){
            res = await fetch(selectedFiles[0].url);
            fileName = selectedFiles[0].name;
        }else{
            const response = await downloadFilesReq(path,selectedFiles,selectedFolders,material._id,false);
            res = response.res;
        }
        setProgress(prevState => prevState+30)
        if(res.ok){
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }else{
            console.log(res);
            window.alert("Error while downloading files.")
        }
        setProgress(100)
        setAction({...action,['downloading']: false});
    }
    return(
        <>
            <LoadingBar color={$blueColor} progress={progress} loaderSpeed={1000}
                         onLoaderFinished={() => setProgress(0)}/>
            <div className={'material-outer'}>
                <div className={'material-structure'}>
                    <div className={'material-structure-search'}>
                        <SearchIcon/>
                        <input placeholder={'Go to file....'}/>
                    </div>
                    <div className={'material-structure-info'}>
                        {allFiles.folders && <FolderStructure pathArray={pathArray} allFiles={allFiles} setPathArray={setPathArray}
                                          setAllFiles={setAllFiles} setProgress={setProgress} showFile={showFile} folder={{name:material.name}} prefix={''} depth={0}
                                          material={material}/>
                        }
                    </div>
                </div>
                <div className={'material-screen'}>
                    <div className={'material-screen-path'}>
                       <Path material={material} setPathArray={setPathArray}   pathArray={pathArray}></Path>
                    </div>
                    <div className={'material-screen-info'}>
                        <div className={'material-screen-heading'}>
                            <div className={'material-screen-heading-name'}>
                                <span>Name</span>
                            </div>
                            {!isFileScreen.isFile && files.total > 0 && (
                                <div className={'material-screen-heading-options'}>
                                    {noSelected > 0 && (
                                        <>
                                            {material.rights.delete && (action.deleting ? (
                                                <TextButtonWithCircularProgress text={'Deleting...'} />
                                            ) : (
                                                <TextButtonWithIcon
                                                    text={'Delete'}
                                                    disabled={action.downloading}
                                                    onClick={deleteFilesEvent}
                                                    Icon={DeleteIcon}
                                                />
                                            ))}
                                            {material.rights.download && (
                                                <>
                                                    {noSelected > 1 && (
                                                        <input
                                                            placeholder={'Enter name of zip file'}
                                                            id={'zipFileName'}
                                                            style={{ marginRight: "0.5rem" }}
                                                        />
                                                    )}
                                                    {action.downloading ? (
                                                        <TextButtonWithCircularProgress text={'Downloading...'} />
                                                    ) : (
                                                        <TextButtonWithIcon
                                                            disabled={action.deleting}
                                                            text={'Download'}
                                                            onClick={downloadFilesEvent}
                                                            Icon={DownloadIcon}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                    <Checkbox
                                        checked={checked}
                                        onChange={onSelection}
                                        size={'medium'}
                                        color={'primary'}
                                        sx={{ color: $borderColor, '&.Mui-checked': { color: $lightBlue } }}
                                    />
                                </div>
                            )}
                        </div>
                        {pathArray.length >= 1 && pathArray[pathArray.length-1].type==='folder' && <FolderInfo folder={{name:'. .',type:'folder'}} setPathArray={setPathArray}/>}
                        {!isFileScreen.isFile && files.folders.map((folder,i)=><FolderInfo setFiles={setFiles} setNoSelected={setNoSelected} key={i} folder={folder} setPathArray={setPathArray}/>)}
                        {!isFileScreen.isFile  && files.files.map((file,i)=><FileInfo setNoSelected={setNoSelected} setFiles={setFiles} showFile={showFile} key={i}  file={file}/>)}
                        {isFileScreen.isFile && <FileViewer pathArray={pathArray} file={isFileScreen.file} setIsFileScreen={setIsFileScreen}/>}
                    </div>
                </div>
            </div>
        </>
    )
}

export  function TextButtonWithIcon({text,disabled,Icon,onClick}){
    return(
        <>
            <div onClick={onClick} style={disabled ? {cursor:"not-allowed"}:{}} className={'text-with-icon'}>
                {Icon && <Icon/>}
                <span>{text}</span>
            </div>
        </>
    )
}
export  function TextButtonWithCircularProgress({text}){
    return(
        <>
            <div style={{cursor:"not-allowed"}} className={'text-with-icon'}>
                <CustomCircularProgress progressSize={'20px'} precentage={70} progressColor={$blueColor} trackColor={'transparent'} />
                <span>{text}</span>
            </div>
        </>
    )
}