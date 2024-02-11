import {useEffect, useRef, useState} from "react";
import {getFileContentAsText} from "./fetchRequest";
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'
export default function FileViewer({file,setIsFileScreen,pathArray}){
    let ext = file.name.split('.').pop().toLowerCase();
    let rawFileExt = ['c','cpp','java','txt','c++','js'];

    useEffect(() => {
        if(pathArray[pathArray.length-1].type==='folder'){
            setIsFileScreen({isFile:false,file:{}})
        }else{
            const getContent = async()=>{
                const pre = document.getElementById('pretag');
                let newEle = document.createElement("code");
                if(pre){
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
                }
            }
            getContent();
        }
    }, [pathArray]);
    console.log(ext)
    console.log(rawFileExt.includes(ext))
    return(
        <>
            <div className={'content-screen'}>
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