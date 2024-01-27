import {useParams} from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import "../3.styles/material.scss"
import {FileInfo, FileStructure, FolderInfo, FolderStructure, Path} from "../2.components/material/component";
export default function Material(){
    const {id} = useParams();
    return(
        <>
            <div className={'material-outer'}>
                <div className={'material-structure'}>
                    <div className={'material-structure-search'}>
                        <SearchIcon/>
                        <input placeholder={'Go to file....'}/>
                    </div>
                    <div className={'material-structure-info'}>
                        {/*<FolderStructure/>*/}
                    </div>
                </div>
                <div className={'material-screen'}>
                    <div className={'material-screen-path'}>
                       <Path></Path>
                    </div>
                    <div className={'material-screen-info'}>
                        <div className={'material-screen-heading'}>
                            <span>Name</span>
                        </div>
                        {/*<FolderInfo/>*/}
                    </div>
                </div>
            </div>
        </>
    )
}