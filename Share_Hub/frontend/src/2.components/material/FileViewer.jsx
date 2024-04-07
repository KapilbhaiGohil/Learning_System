import {useEffect, useRef, useState} from "react";
import {getFileContentAsText} from "./fetchRequest";
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'
// import 'highlight.js/styles/github-dark.css'
import LoadingBar from "react-top-loading-bar";
import {CancelPresentation} from "@mui/icons-material";
export default function FileViewer({file,setIsFileScreen,pathArray}){
    let ext = file.name.split('.').pop().toLowerCase();
    let rawFileExt =  [
        "c",
        "cpp",
        "java",
        "txt",
        "c++",
        "js",
        "in",
        "out",
        "scss",
        "json",
        "csv",
        "tsv",
        "html",
        "css",
        "py",
        "rb",
        "swift",
        "go",
        "ts",
        "lua",
        "pl",
        "sql",
        "asm",
        "sh",
        "bat",
        "ps1",
        "xml",
        "yaml",
        "ini",
        "conf",
        "cfg",
        "properties",
        "h",
        "hpp",
        "cs",
        "vb",
        "jsx",
        "tsx",
        "vue",
        "ejs",
        "erb",
        "jade",
        "pug",
        "handlebars",
        "jsp",
        "asp",
        "aspx",
        "cfm",
        "r",
        "rs",
        "scala",
    ];
    let imageFiles = ['jpeg','avif','jpg','jpeg','jfif','png','svg','webp'];
    const [progress,setProgress] = useState(0);

    useEffect(() => {
        if(pathArray[pathArray.length-1].type==='folder'){
            setIsFileScreen({isFile:false,file:{}});
        }else{
            const getContent = async()=>{
                const pre = document.getElementById('pretag');
                let newEle = document.createElement("code");
                if(pre){
                    setProgress(70);
                    let child = pre.lastChild;
                    while (child){
                        pre.removeChild(child);
                        child = pre.lastChild;
                    }
                    pre.appendChild(newEle)
                    let text = await getFileContentAsText(file.url);
                    newEle.textContent = text;
                    newEle.id='code';
                    hljs.highlightElement(newEle)
                    setProgress(100);
                }
            }
            getContent();
        }
        // return(()=>{setIsFileScreen({isFile:false,file:{}})})
    }, [pathArray]);
    console.log(ext)
    console.log(rawFileExt.includes(ext))
    return(
        <>
            <div className={'content-screen'}>
                <LoadingBar containerStyle={{position:'absolute'}} color={'#2f81f7'} progress={progress} loaderSpeed={1000} onLoaderFinished={()=>{setProgress(0)}}/>
                {
                    ext==='pdf' &&
                    <iframe src={file.url} type={'application/pdf'}/>
                }
                {
                    imageFiles.includes(ext) &&
                        <img src={file.url} style={{maxWidth:"100%"}} alt={'error while getting data'}/>
                }
                {
                    rawFileExt.includes(ext) &&
                    <>
                        <pre id={'pretag'}>
                        </pre>
                    </>
                }
                {
                    !rawFileExt.includes(ext) && !imageFiles.includes(ext) && !['pdf'].includes(ext) &&
                    <>
                        <div className={'no-preview'}>
                            <CancelPresentation />
                            <p>No preview available</p>
                        </div>
                    </>
                }
            </div>
        </>
    )
}