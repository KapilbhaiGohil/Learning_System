import {useEffect, useRef, useState} from "react";
import {getFileContentAsText} from "./fetchRequest";
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'
import {LoadingWithText} from "./component";
import LoadingBar from "react-top-loading-bar";
export default function FileViewer({file,setIsFileScreen,pathArray}){
    let ext = file.name.split('.').pop().toLowerCase();
    let rawFileExt = ['c','cpp','java','txt','c++','js','in','out','scss','json'];
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
                    ['jpeg','avif','jpg','jpeg','jfif','png','svg','webp',].includes(ext) &&
                        <img src={file.url} alt={'error while getting data'}/>
                }
                {
                    rawFileExt.includes(ext) &&
                    <>
                        <pre id={'pretag'}>
                        </pre>
                    </>
                }
            </div>
        </>
    )
}