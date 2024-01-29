import {useEffect} from "react";

export default function FileViewer({file,setIsFileScreen}){
    let ext = file.name.split('.').pop().toLowerCase();
    console.log(ext)
    // useEffect(() => {
    //     return ()=>{
    //         setIsFileScreen({isFile:false,file:{}})
    //     }
    // }, []);
    return(
        <>
            {ext==='pdf' &&
                <embed src={file.url} type={'application/pdf'}/>
            }
        </>
    )
}