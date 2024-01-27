import {
    FolderRounded,
    FolderOpenRounded,
    InsertDriveFileOutlined,
    CloudUploadOutlined,
    ChevronRightRounded, AddOutlined, MoreHorizOutlined, FolderOutlined
} from '@mui/icons-material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {Link} from "react-router-dom";
import {useState} from "react";

export function FolderStructure(){
    return(
        <>
            <div className={'folder-structure-outer'}>
                <ChevronRightRounded/>
                <FolderRounded/>
                <span>Backend</span>
            </div>
        </>
    )
}
export function FileStructure(){
    return(
        <>
            <div className={'file-structure-outer'}>
                <InsertDriveFileOutlined/>
                <span>file</span>
            </div>
        </>
    )
}
export function FolderInfo(){
    return(
        <>
            <div className={'folder-info-outer'}>
                <FolderRounded/>
                <span>Folder name</span>
            </div>
        </>
    )
}
export function FileInfo(){
    return(
        <>
            <div className={'file-info-outer'}>
                <InsertDriveFileOutlined/>
                <span>file name</span>
            </div>
        </>
    )
}
export function Path(){
    const [expand,setExpand] = useState(false);
    const addFileClick=(e)=>{
        setExpand(!expand);
    }
    return(
        <>
            <div className={'path-outer'}>
                <div className={'path'}>
                    <ol>
                        <li>
                            <Link to={'hoel'}>Data-structure-and-algorithm</Link>
                            <span>/</span>
                        </li>
                        <li>
                            <Link to={'hoel'}>world</Link>
                            <span>/</span>
                        </li>  <li>
                        <Link to={'hoel'}>majsk</Link>
                        <span>/</span>
                    </li>
                    </ol>
                </div>
                <div className={'path-right'}>
                    <div onClick={addFileClick} className={'path-add-file'}>
                        <button>Add file</button>
                        <AddOutlined/>
                    </div>
                    {expand && <div className={'path-add-file-extension'} id={'file-extension'}>
                        <div>
                            <CloudUploadOutlined/>
                            <span>Upload Files</span>
                        </div>
                    </div>}
                    <div className={'path-options'}>
                        <MoreHorizOutlined/>
                    </div>
                </div>
            </div>
            {/*<UploadScreen/>*/}
        </>
    )
}
export function UploadScreen(){
    return(
        <>
            <div className={'upload'}>
                <div className={'upload-outer'}>
                    <div className={'upload-info'}>

                    </div>
                    <div className={'upload-buttons'}>
                        <input type={'file'} />
                        <button>Upload</button>
                    </div>
                </div>
            </div>
        </>
    )
}