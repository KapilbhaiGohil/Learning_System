import {
    FolderRounded,
    FolderOpenRounded,
    InsertDriveFileOutlined,
    CloudUploadOutlined,
    ChevronRightRounded, AddOutlined, MoreHorizOutlined
} from '@mui/icons-material';
import {useEffect, useState} from "react";
import CloseIcon from '@mui/icons-material/Close';
import {getFilesList, getPathAsString, uploadFile} from "./fetchRequest";

export function FolderStructure({allFiles,setAllFiles,pathArray,setPathArray,folder,prefix,material,depth}){
    const [isOpen,setIsOpen] = useState(false);
    const [files,setFiles] = useState({});
    console.log("all files info from folder structure : ",allFiles)
    const openFolderContentOnStructure=async(e,destFolder,manual=false)=>{
        e.preventDefault();
        e.stopPropagation();
        console.log('open value ',isOpen);
        if(manual)setIsOpen(true);
        if(!isOpen){
            let temp = {...allFiles},item = temp,prefixArray = prefix.split('/');
            for (let i = 0; i < prefixArray.length; i++) {
                for (let j = 0; j < item.folders.length; j++) {
                    console.log(i,j,prefix,item)
                    if(item.folders[j].name===prefixArray[i]){
                        item = item.folders[j];
                        break;
                    }
                }
            }
            if((item.files.length>0 || item.folders.length>0) && !manual){
                setFiles(item);
                setIsOpen(true);
            }else{
                const {res,data} = await getFilesList(material._id+"/"+prefix);
                if(res.ok){
                    setFiles(data);
                    item.name = destFolder.name
                    item.files = data.files
                    item.folders = data.folders
                    setAllFiles(temp);
                    setIsOpen(true);
                }
            }

        }else{
            if(!manual)setIsOpen(false);
        }
    }
    useEffect(() => {
        console.log(pathArray)
        console.log(prefix,folder.name)
    }, [pathArray]);
    const selectFolder=async(e)=>{
        e.preventDefault();
        e.stopPropagation();
        console.log(prefix)
        setIsOpen(false)
        await openFolderContentOnStructure(e,folder,true);
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
            <div onClick={(e)=>{selectFolder(e,true)}} style={prefix==='' ? {marginLeft:`9px`}:{marginLeft: "9px",borderLeft:"1px solid #373737"}}>
                <div className={'folder-structure-outer'}>
                    <div onClick={(e)=>{openFolderContentOnStructure(e,folder)}} className={'folder-structure-angular'}>
                        <ChevronRightRounded style={isOpen ? {transform:"rotate(90deg)"} :{}} />
                    </div>
                    <div className={'folder-structure-folder'}>
                        {isOpen ?<FolderOpenRounded/> :<FolderRounded/>}
                        <div className={'folder-structure-name'}>{folder.name}</div>
                    </div>
                </div>
                {isOpen && files.folders && files.folders.map((folder,i)=><FolderStructure key={i} pathArray={pathArray} setPathArray={setPathArray} folder={folder} material={material} setAllFiles={setAllFiles} depth={depth+1} allFiles={allFiles} prefix={prefix.length>0 ?prefix+"/"+folder.name:folder.name}/>)}
                {isOpen && files.files && files.files.map((file,i)=><FileStructure key={i}  file={file}/>)}
            </div>
        </>
    )
}
export function FileStructure({file}){
    return(
        <>
            <div style={{marginLeft:`9px`,borderLeft:"1px solid #373737",borderRadius:"0"}} >
                <div className={'file-structure-outer'}>
                    <InsertDriveFileOutlined/>
                    <span>{file.name}</span>
                </div>
            </div>
        </>
    )
}
export function FolderInfo({folder,setPathArray}){
    const handleFolderClick = (e)=>{
        if(folder.name==='. .'){setPathArray((prev)=>{
            let temp = [...prev];
            temp.pop();
            return temp;
        })}
        else{
            setPathArray((prev)=>[...prev, {name:folder.name,type:'folder'}]);
        }
    }
    return(
        <>
            <div style={{ cursor: folder.name === '. .' ? 'pointer' : ''}} onClick={ folder.name==='. .' ? handleFolderClick : ()=>{}} className={'folder-info-outer'}>
                <FolderRounded/>
                <span onClick={handleFolderClick}>{folder.name}</span>
            </div>
        </>
    )
}
export function FileInfo({file,showFile}){
    return(
        <>
            <div className={'file-info-outer'}>
                <InsertDriveFileOutlined/>
                <span onClick={(e)=>{showFile(e,file)}}>{file.name}</span>
            </div>
        </>
    )
}
export function Path({material,pathArray,setPathArray}){
    const [expand,setExpand] = useState(false);
    const [uploadScreen,setUploadScreen] = useState(false);
    const addFileClick=(e)=>{
        setExpand(!expand);
    }
    const uploadFileClick=(e)=>{
        setUploadScreen(!uploadScreen);
    }
    const spanPathClick=(e,i)=>{
        let newPathArray = [];
        for (let j = 0; j <= i; j++) {
            newPathArray.push(pathArray[j]);
        }
        setPathArray(newPathArray);
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
                    <div onClick={addFileClick} className={'path-add-file'}>
                        <button>Add file</button>
                        <AddOutlined/>
                    </div>
                    {expand && <div className={'path-add-file-extension'} id={'file-extension'}>
                        <div onClick={uploadFileClick}>
                            <CloudUploadOutlined/>
                            <span>Upload Files</span>
                        </div>
                    </div>}
                    <div className={'path-options'}>
                        <MoreHorizOutlined/>
                    </div>
                </div>
            </div>
            {uploadScreen && <UploadScreen uploadFileClick={uploadFileClick} setPathArray={setPathArray} pathArray={pathArray} material={material}/>}
        </>
    )
}
export function UploadScreen({uploadFileClick,pathArray,setPathArray,material}){
    const [files,setFiles] = useState([]);
    const closeScreen = ()=>{
        let ele = document.getElementById('upload');
        ele.style.transition="all 0.4s";
        ele.style.top = "100%";
        setTimeout(()=>{uploadFileClick()},400);
    }
    useEffect(() => {
        let ele = document.getElementById('upload');
        ele.style.transition="all 0.4s";
        ele.style.top="100%";
        setTimeout(()=>{ ele.style.top = "0";},10);
    }, []);
    const fileInput = (e)=>{
        let newFiles = [];
        for (let i = 0; i < e.target.files.length; i++) {
            newFiles.push(e.target.files[i]);
        }
        setFiles([...files,...newFiles]);
    }
    const removeFile=(index)=>{
        const temp = [...files];
        temp.splice(index,1);
        setFiles(temp);
    }

    function handleDragEnter(e) {
        e.preventDefault()
    }

    function handleDragOver(e) {
        e.preventDefault()
    }

    function handleDragLeave(e) {
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
        e.preventDefault()
        let items = e.dataTransfer.items;
        for (let i = 0; i < items.length; i++) {
            let item = items[i].webkitGetAsEntry();
            traverseFileTree(item);
        }
    }
    const uploadFilesClick=async (e)=>{
        let initialPath = material._id;
        if(pathArray.length>0)initialPath+='/'+getPathAsString(pathArray,1);
        for (let i = 0; i < files.length; i++) {
            const filesData = new FormData();
            filesData.append(`inputFile`,files[i]);
            filesData.append('initialPath',initialPath);
            if(files[i].manualPath)filesData.append('manualPath',files[i].manualPath);
            const {res,data} = await uploadFile(filesData);
        }
        console.log(files);
        setPathArray((prev)=>[...prev]);
        uploadFileClick();
    }
    return(
        <>
            <div className={'upload'} id={'upload'}>
                <div className={'upload-outer'}>
                    <div className={'upload-heading'}>
                        <span>Upload Files</span>
                    </div>
                    <div className={'upload-area'}>
                        <div className={'upload-info'}>
                            <div className={'upload-input'}>
                                <span>Your files</span>
                            </div>
                            {files.length>0 && files.map((f,i)=><UploadedFile key={i}  file={f} index={i} removeFile={removeFile}/>)}
                        </div>
                        <div className={'upload-drag-area'}>
                            <div className={'upload-input'}>
                                <input type={'file'} multiple={true} onChange={fileInput}/>
                            </div>
                            <div className={'upload-drag-area-div'} onDragEnter={handleDragEnter}
                                 onDragOver={handleDragOver}
                                 onDragLeave={handleDragLeave}
                                 onDrop={handleDrop}>
                                <p> Drag and drop your files here</p>
                            </div>
                        </div>
                    </div>
                    <div className={'upload-control'}>
                        <div className={'upload-buttons'}>
                            <button className={'close-btn'} onClick={closeScreen}>Close</button>
                            <button onClick={uploadFilesClick}>Upload</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function UploadedFile({removeFile,file,index}){
    return(
        <>
            <div className={'upload-file'}>
                <div className={'upload-file-info'}>
                    <InsertDriveFileOutlined/>
                    <span>{file.manualPath}{file.name}</span>
                </div>
                <div className={'upload-file-close'}>
                    <CloseIcon onClick={()=>{removeFile(index)}}/>
                </div>
            </div>
        </>
    )
}