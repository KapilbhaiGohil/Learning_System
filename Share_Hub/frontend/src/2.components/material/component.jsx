import {
    FolderRounded,
    InsertDriveFileOutlined,
    CloudUploadOutlined,
    ChevronRightRounded, AddOutlined, CreateNewFolder, DoNotDisturbOutlined
} from '@mui/icons-material';
import fopen from "../../5.assets/folderOpen.svg"
import {useContext, useEffect, useState} from "react";
import CloseIcon from '@mui/icons-material/Close';
import {createFolderReq, getFilesList, getPathAsString, uploadFile} from "./fetchRequest";
import {Cookies} from "react-cookie";
import {Context} from "../../Context";
import {useNavigate} from "react-router-dom";
import {Checkbox, LinearProgress} from "@mui/material";
import {$blueColor, $borderColor, $err, $lightBlue} from "../globle";
import LoadingBar from "react-top-loading-bar";
import {CustomCircularProgress} from "../home/components";

export function FolderStructure({allFiles,setAllFiles,pathArray,showFile,setProgress,setPathArray,folder,prefix,material,depth}){
    const [isOpen,setIsOpen] = useState(false);
    const [files,setFiles] = useState({});
    const [circularProgress,setCircularProgress] = useState(false);

    const openFolderContentOnStructure=async(e,destFolder)=>{
        e.preventDefault();
        e.stopPropagation();
        if(!isOpen){
            setIsOpen(true);
            setCircularProgress(true);
            let temp = {...allFiles},item = temp,prefixArray = prefix.split('/');
            for (let i = 0; i < prefixArray.length; i++) {
                for (let j = 0; j < item.folders.length; j++) {
                    if(item.folders[j].name===prefixArray[i]){
                        item = item.folders[j];
                        break;
                    }
                }
            }
            if((item.folders.length>0 || item.files.length>0)){
                setFiles(item);
                console.log("buffered data for ",folder)
            }else{
                const {res,data} = await getFilesList(material._id+"/"+prefix,material._id);
                if(res.ok){
                    setFiles(data);
                    item.name = destFolder.name
                    item.files = data.files
                    item.folders = data.folders
                    setAllFiles(temp);
                }
            }
            setCircularProgress(false);
        }else{
            setIsOpen(false);
            if(circularProgress)setCircularProgress(!circularProgress);
        }
    }
    useEffect(() => {
        let temp = prefix.split('/');
        if(depth>pathArray.length-1){
            if(temp.includes(pathArray[pathArray.length-1].name)|| pathArray.length===1){
                setIsOpen(false);
                setFiles([]);
            }
        }
    }, [pathArray]);
    useEffect(() => {
        if(depth === pathArray.length-1 && folder.name===pathArray[pathArray.length-1].name){
            let temp = {...allFiles},item = temp,prefixArray = prefix.split('/');
            for (let i = 0; i < prefixArray.length; i++) {
                for (let j = 0; j < item.folders.length; j++) {
                    if(item.folders[j].name===prefixArray[i]){
                        item = item.folders[j];
                        break;
                    }
                }
            }
            setFiles(item);
            setIsOpen(true);
        }
    }, [allFiles]);
    const selectFolder=async(e)=>{
        e.preventDefault();
        e.stopPropagation();
        if(prefix.length>0){
            let temp = prefix.split('/'),ans=[pathArray[0]];
            for (let i = 0; i < temp.length; i++) {
                ans.push({name:temp[i],type:'folder'});
            }
            setPathArray(ans);
        }
        else setPathArray([{name:folder.name,type:'folder'}]);
    }
    return(
        <>
            <div style={prefix==='' ? {marginLeft:`9px`}:{marginLeft: "9px",borderLeft:"1px solid #373737"}}>
                <div onClick={(e)=>{selectFolder(e,true)}} className={'folder-structure-outer'}>
                    <div onClick={(e)=>{openFolderContentOnStructure(e,folder)}} className={'folder-structure-angular'}>
                        <ChevronRightRounded style={isOpen ? {transform:"rotate(90deg)"} :{}} />
                    </div>
                    <div className={'folder-structure-folder'}>
                        {isOpen ?<FolderOpenLogo/> : <FolderRounded/>}
                        <div className={'folder-structure-name'}>{folder.name}</div>
                    </div>
                </div>
                {circularProgress && <LoadingWithText text={'Loading...'} />}
                {isOpen && files.folders && files.folders.map((folder,i)=><FolderStructure setProgress={setProgress} key={i} showFile={showFile} pathArray={pathArray} setPathArray={setPathArray} folder={folder} material={material} setAllFiles={setAllFiles} depth={depth+1} allFiles={allFiles} prefix={prefix.length>0 ?prefix+"/"+folder.name:folder.name}/>)}
                {isOpen && files.files && files.files.map((file,i)=><FileStructure key={i} prefix={prefix} onlyOneFile={files.files.length+files.folders.length===1} showFile={showFile}  file={file}/>)}
            </div>
        </>
    )
}
export function FileStructure({file,showFile,prefix,onlyOneFile}){
    return(
        <>
            <div style={{marginLeft:`9px`,borderLeft:"1px solid #373737",borderRadius:"0"}} >
                {file.name!=='folder_storing_purpose.txt' ?
                <div onClick={(e)=>{showFile(e,file,true,prefix)}} className={'file-structure-outer'}>
                    <InsertDriveFileOutlined/>
                    <span>{file.name}</span>
                </div>:
                    onlyOneFile &&
                <div className={'file-structure-outer'}>
                    <DoNotDisturbOutlined/>
                    <span>No files found.</span>
                </div>
                }
            </div>
        </>
    )
}
export function FolderInfo({folder,setPathArray,setFiles,setNoSelected}){
    const navigate = useNavigate();
    const [checked,setChecked] = useState(false);
    useEffect(() => {
        if(folder.selected!==undefined)setChecked(folder.selected);
        else setChecked(false);
    }, [folder.selected]);
    const handleFolderClick = (e)=>{
        if(folder.name==='. .'){
            setPathArray((prev)=>{
                if(prev.length===1){
                    navigate('/home');
                    return prev;
                }else{
                    let temp = [...prev];
                    temp.pop();
                    return temp;
                }
            })
        }
        else{
            setPathArray((prev)=>[...prev, {name:folder.name,type:'folder'}]);
        }
    }
    const onSelection=(e)=>{
        setFiles((prev)=>{
            let temp = {...prev};
            temp.folders = temp.folders.map(f=>{
                if(f.name===folder.name){
                    f.selected = !checked
                    return f;
                }
                return f;
            });
            return temp;
        })
        checked ? setNoSelected((prev)=>prev-1) : setNoSelected((prev)=>prev+1);
        setChecked(!checked);
    }
    return(
        <>
            <div style={{ cursor: folder.name === '. .' ? 'pointer' : ''}} onClick={ folder.name==='. .' ? handleFolderClick : ()=>{}} className={'folder-info-outer'}>
                <div className={'folder-info'}>
                    <FolderRounded/>
                    <span onClick={handleFolderClick}>{folder.name}</span>
                </div>
                <div className={'folder-info-options'}>
                    {folder.name!=='. .' && <Checkbox checked={checked} onChange={onSelection} size={'medium'}  color={'primary'}
                               sx={{color: $borderColor, '&.Mui-checked': {color: $lightBlue,},}}/>}
                </div>
            </div>
        </>
    )
}
export function FileInfo({file,showFile,setFiles,setNoSelected}){
    const[checked,setChecked] = useState(false);
    useEffect(() => {
        if(file.selected!==undefined)setChecked(file.selected);
        else  setChecked(false);
    }, [file.selected]);
    const onSelection=(e)=>{
        setFiles((prev)=>{
            let temp = {...prev};
            temp.files = temp.files.map(f=>{
                if(f.storedName===file.storedName){
                    f.selected = !checked
                    return f;
                }
                return f;
            });
            return temp;
        })
        checked ? setNoSelected((prev)=>prev-1) : setNoSelected((prev)=>prev+1);
        setChecked(!checked);
    }
    return(
        <>
            {file.name!=='folder_storing_purpose.txt' &&
                <div className={'file-info-outer'}>
                    <div className={'file-info'}>
                        <InsertDriveFileOutlined/>
                        <span onClick={(e)=>{showFile(e,file)}}>{file.name}</span>
                    </div>
                    <div className={'file-info-options'}>
                        <Checkbox size={'medium'} checked={checked} onChange={onSelection} color={'primary'} sx={{color: $borderColor,'&.Mui-checked': {color: $lightBlue,},}}/>
                    </div>
                </div>
            }
        </>
    )
}
export function Path({material,pathArray,setPathArray}){
    const [expand,setExpand] = useState(false);
    const [uploadScreen,setUploadScreen] = useState(false);
    const [createFolderScreen,setCreateFolderScreen] = useState(false);
    const {activeUser} = useContext(Context);
    const addFileClick=(e)=>{
        if(pathArray[pathArray.length - 1].type !=='folder' && !expand){
            window.alert('Open some folder to expand options.');
        }else{
            setExpand(!expand);
        }
    }
    const uploadFileClick=(e)=>{
        setExpand(false);
        setUploadScreen(!uploadScreen);
    }
    const spanPathClick=(e,i)=>{
        let newPathArray = [];
        for (let j = 0; j <= i; j++) {
            newPathArray.push(pathArray[j]);
        }
        setPathArray(newPathArray);
    }
    const addFolderClick=(e)=>{
        setExpand(false);
        setCreateFolderScreen(!createFolderScreen);
    }
    return(
        <>
            <div className={'path-outer'}>
                <div className={'path'}>
                    <ol>
                        {pathArray && pathArray.map((p,i)=>
                            <li key={i}>
                                <span onClick={(e)=>{spanPathClick(e,i)}} className={'span-link'}>{p.name}</span>
                                {p.type==='folder' && <span>/</span>}
                            </li>
                        )}
                    </ol>
                </div>
                <div className={'path-right'}>
                    {material && material.rights && material.rights.upload &&
                        <div onClick={addFileClick} className={'path-add-file'}>
                            <button>Add file</button>
                            <AddOutlined/>
                        </div>
                    }
                    {expand && <div className={'path-add-file-extension'} id={'file-extension'}>
                        <div onClick={uploadFileClick}>
                            <CloudUploadOutlined/>
                            <span>Upload Files</span>
                        </div>
                        <div onClick={addFolderClick}>
                            <CreateNewFolder />
                            <span>Create Folder</span>
                        </div>
                    </div>}
                    {/*<div className={'path-options'}>*/}
                    {/*    <MoreHorizOutlined/>*/}
                    {/*</div>*/}
                </div>
            </div>
            {uploadScreen && <UploadScreen uploadFileClick={uploadFileClick} setPathArray={setPathArray} pathArray={pathArray} material={material}/>}
            {createFolderScreen && <CreateFolder addFolderClick={addFolderClick} pathArray={pathArray} setPathArray={setPathArray} material={material}/>}
        </>
    )
}
export function CreateFolder({addFolderClick,pathArray,material,setPathArray}){
    const [error,setError]  = useState({msg:'',field:''})
    const [folderName,setFolderName] = useState('');
    const [action,setAction] = useState({creating:false});
    const folderNameChange=(e)=>{
        setFolderName(e.target.value);
        if(error.msg.length>0)setError({msg:'',field: ''});
    }
    const closeScreen = ()=>{
        let ele = document.getElementById('create-folder');
        ele.style.transition="all 0.4s";
        ele.style.top = "100%";
        setTimeout(()=>{addFolderClick()},400);
    }
    useEffect(() => {
        let ele = document.getElementById('create-folder');
        ele.style.transition="all 0.4s";
        ele.style.top="100%";
        setTimeout(()=>{ ele.style.top = "0";},10);
    }, []);
    const createFolder=async (e)=>{
        setError({field: '',msg: ''})
        setAction({creating: true})
        const path = getPathAsString(pathArray,1);
        const {res,data} = await createFolderReq(path,material,folderName);
        if(res.ok){
            setPathArray([...pathArray]);
            closeScreen();
        }else{
            setError({msg:data.msg,field:''});
        }
        setAction({creating: false})
    }
    return(
        <>
            <div id={'create-folder'} className={'create-folder'}>
                <div className={'create-folder-outer'}>
                    {action.creating && <LinearProgress
                        sx={{position: "absolute", inset: "0 0 0 0", height: "2px", background: "transparent"}}/>}
                    <div className={'create-folder-heading'}>
                        <h4>Create new folder</h4>
                    </div>
                    <div className={'create-folder-input'}>
                        <input onChange={folderNameChange} placeholder={'Enter folder name'} type={'text'} required={true}/>
                        {error.msg.length>0 && <p className={'error-msg'}>{error.msg}</p>}
                    </div>
                    <div className={'create-folder-buttons'}>
                        {action.creating ?
                            <button disabled={true}><CustomCircularProgress precentage={70} trackColor={'transparent'} progressColor={'black'}/></button>
                            : <button onClick={createFolder} >Create</button>}
                        <button className={'close-btn'} disabled={action.creating} onClick={closeScreen}>Close</button>
                    </div>
                </div>
            </div>
        </>
    )
}
async function uploadFilesHelper(material,pathArray,setProgress,files,setUpload,setFileUploading,setFailed){
    let initialPath = material._id;
    if(pathArray.length>0)initialPath+='/'+getPathAsString(pathArray,1);
    const token = new Cookies().get('token');
    setProgress(prev=>prev+10);
    for (let i = 0; i < files.length; i++) {
        const filesData = new FormData();
        filesData.append(`inputFile`,files[i]);
        filesData.append('initialPath',initialPath);
        filesData.append('token',token);
        filesData.append('materialId',material._id);
        if(files[i].manualPath)filesData.append('manualPath',files[i].manualPath);
        setUpload({state: true,curr: `${(files[i].manualPath || '')}${files[i].name}`,uploadOver: 'start'});
        const {res,data} = await uploadFile(filesData);
        setFileUploading(prev=>[{manualPath:files[i].manualPath,status:res.ok,name:files[i].name},...prev]);
        if(!res.ok){
            setFailed(prev=>[...prev,files[i]]);
        }
        setProgress(prevState => prevState+(70/files.length));

    }
}
export function UploadScreen({uploadFileClick,pathArray,setPathArray,material}){
    const [files,setFiles] = useState([]);
    const [progress,setProgress] = useState(0);
    const [fileUploading,setFileUploading] = useState([]);
    const [failed,setFailed] = useState([])
    const [upload ,setUpload] = useState({state:false,curr:'',uploadOver:'notStart'});//notStart,start,completed
    const closeScreen = ()=>{
        let ele = document.getElementById('upload');
        ele.style.transition="all 0.4s";
        ele.style.top = "100%";
        setTimeout(()=>{
            uploadFileClick(); if(fileUploading.length!==0)setPathArray((prev)=>[...prev]);},400);
    }
    useEffect(() => {
        let ele = document.getElementById('upload');
        ele.style.transition="all 0.4s";
        ele.style.top="100%";
        setTimeout(()=>{ ele.style.top = "0";},10);
    }, []);
    const fileInput = (e)=>{
        if(upload.state===false){
            setUpload({state: false,curr: '',uploadOver: 'notStart'})
            setFileUploading([]);
        }
        let newFiles = [];
        for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files[i];
            file.manualPath = file.webkitRelativePath.substring(0,file.webkitRelativePath.length - file.name.length);
            newFiles.push(file);
        }
        setFiles([...files,...newFiles]);
    }
    const removeFile=(index)=>{
        const temp = [...files];
        temp.splice(index,1);
        setFiles(temp);
    }

    function handleDragEOL(e) {
        e.preventDefault()
    }
    function traverseFileTree(item, path) {
        path = path || "";
        if (item.isFile) {
            item.file(function(file) {
                setFiles((prev)=>{
                    file.manualPath = path;
                    return [...prev,file]
                });
            });
        } else if (item.isDirectory) {
            let dirReader = item.createReader();
            dirReader.readEntries(function(entries) {
                for (let i=0; i<entries.length; i++) {
                    traverseFileTree(entries[i], path + item.name + "/");
                }
            });
        }
    }
    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation()
        let items = e.dataTransfer.items;
        for (let i = 0; i < items.length; i++) {
            let item = items[i].webkitGetAsEntry();
            if(item && upload.state===false){
                setUpload({state: false,curr: '',uploadOver: 'notStart'})
                setFileUploading([]);
                traverseFileTree(item)
            }
        }
    }
    const uploadFilesClick=async (e,isFailed)=>{
        if(isFailed){
            setFiles(prev=>failed);
            setFailed([]);
            setFileUploading([]);
        }
        if(files.length===0){
            window.alert('Select atleast one file to upload.');
        }else{
            let temp = files;
            if(isFailed)temp = failed;
            await uploadFilesHelper(material,pathArray,setProgress,temp,setUpload,setFileUploading,setFailed);
            setUpload({state: false,curr: ``,uploadOver: 'completed'});
            setProgress(100);
            setFailed(prev=>{
                if(prev.length===0){
                    setFiles([]);
                }
                return prev;
            })
        }
    }
    return(
        <>
            <LoadingBar color={$blueColor} progress={progress} loaderSpeed={500}
                        onLoaderFinished={() => setProgress(0)}/>
            <div className={'upload'} id={'upload'}>
                <div className={'upload-outer'}>
                    <div className={'upload-heading'}>
                        <span>Upload Files</span>
                    </div>
                    <div className={'upload-area'}>
                        {!upload.state && upload.uploadOver==='notStart' &&
                            <>
                                <UploadBox files={files} removeFile={removeFile} label={'Your Files'}/>
                            </>
                        }
                        {upload.state && upload.uploadOver==='start' &&
                            <>
                                <UploadBox files={fileUploading} label={`Uploading : `} currFile={upload.curr} loader={true}/>
                            </>
                        }
                        {!upload.state && upload.uploadOver==='completed' &&
                            <>
                                <UploadBox files={fileUploading} label={`${fileUploading.length-failed.length} : Successfull ,${failed.length} : Unsuccessfull`}/>
                            </>
                        }
                        <DrageArea fileInput={fileInput} disabled={upload.state || failed.length>0} handleDragEOL={handleDragEOL} handleDrop={handleDrop}/>
                    </div>
                    <div className={'upload-control'}>
                        <div className={'upload-buttons'}>
                            <button className={'close-btn'} disabled={upload.state} onClick={closeScreen}>Close</button>
                            <button style={{display:"flex",justifyContent:"center",alignItems:"center"}} onClick={(e)=>uploadFilesClick(e,upload.uploadOver==='completed' && failed.length>0)} disabled={upload.state}>
                                {upload.state ? <CustomCircularProgress precentage={70} trackColor={'transparent'} progressColor={'black'}/>
                                    : upload.uploadOver==='completed' && failed.length>0 ?
                                    'Upload (failed)':
                                    'Upload'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
function UploadBox({files,removeFile,label,loader,currFile}){
    return(
        <>
            <div className={'upload-info'}>
                <div className={'upload-input'}>
                    {loader &&
                        <div style={{display:'flex',alignItems:'center',paddingLeft:'1rem'}}>
                            <CustomCircularProgress progressColor={$blueColor} precentage={70}  trackColor={'transparent'}/>
                            <span style={{paddingLeft:'0',color:$blueColor}}>{label}</span>
                            <span style={{paddingLeft:'0'}}>{currFile.substring(0,55)} {currFile.length>55 && '....'}</span>
                        </div>
                    }
                    {!loader && <span>{label}</span>}
                </div>
                {files.length>0 && files.map((f,i)=><UploadedFile color={f.status===undefined?'':f.status ? 'green':$err} key={i} file={f} index={i} removeFile={removeFile}/>)}
            </div>
        </>
    )
}

export function UploadedFile({removeFile,file,index,color}){
    let currFile = file ? (file.manualPath||'')+file.name : '';
    return(
        <>
            <div className={'upload-file'}>
                <div className={'upload-file-info'}>
                    <InsertDriveFileOutlined sx={{color:color}}/>
                    <span style={{color:color}}>{currFile.substring(0,55)}{currFile.length>55 && '....'}</span>
                </div>
                {removeFile && <div className={'upload-file-close'}>
                    <CloseIcon onClick={() => {
                        removeFile(index)
                    }}/>
                </div>}
            </div>
        </>
    )
}
export function LoadingWithText({text}){
    return(
        <>
            <div  className={'circularProgress'}>
                <CustomCircularProgress progressSize={'20px'} precentage={70} trackColor={'transparent'} thickness={2} size={"sm"} variant={'soft'}  color={'neutral'}/>
                <span >{text}</span>
            </div>
        </>
    )
}
export function DrageArea({fileInput,handleDragEOL,handleDrop,disabled}){
    return(
        <>
            <div className={'upload-drag-area'}>
                <div className={'upload-input'}>
                    <input type={'file'} disabled={disabled} multiple={true} onChange={fileInput}/>
                    <input id={'addFolderInput'} disabled={disabled} type={'file'} onChange={fileInput} webkitdirectory={""} mozdirectory={""} directory={""} multiple/>
                </div>
                <div className={'upload-drag-area-div'} onDragEnter={handleDragEOL}
                     onDragOver={handleDragEOL}
                     onDragLeave={handleDragEOL}
                     onDrop={handleDrop}>
                    <p> Drag and drop your files here</p>
                </div>
            </div>
        </>
    )
}
export function FolderOpenLogo(){
    return(
        <>
            <img src={fopen} style={{width:"1.2rem"}}/>
        </>
    )
}