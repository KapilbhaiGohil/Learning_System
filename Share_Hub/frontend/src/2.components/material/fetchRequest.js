import {Cookies} from "react-cookie";

const url = "http://localhost:8080"
const cookies = new Cookies();
const token = cookies.get('token');

export const getMaterialById=async (materialId)=>{
    try{
        const res = await fetch(url+'/material/getMaterialById',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({materialId,token})
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
        return {res: {ok:false},data: {e,msg:e.message}};
    }
}
export const uploadFile=async (formData)=>{
    console.log(formData,"at the time of uploading")
    try{
        const res = await fetch(url+'/material/upload',{
            method:"POST",
            body:formData
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log("error while uploading file : ",e);
        return {res: {ok:false},data: {e,msg:e.message}};
    }
}
export  const createFolderReq=async (path,material,folderName)=>{
    try{
        const res = await fetch(url+'/material/createFolder',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({path,token,material,folderName})
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
        return {res: {ok:false},data: {e,msg:e.message}};
    }
}
export const getFilesList=async (path,materialId)=>{
    try{
        const res = await fetch(url+'/material/getFilesList',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({path,token,materialId})
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
        return {res: {ok:false},data: {e,msg:e.message}};
    }
}

export const deleteFileRequest=async (path,materialId,type)=>{
    try{
        const res = await fetch(url+'/material/deleteFile',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({path,token,materialId,type})
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
        return {res: {ok:false},data: {e,msg:e.message}};
    }
}
export function getPathAsString(pathArray,start=0){
    let str = "";
    for (let i = start; i < pathArray.length; i++) {
        str+=pathArray[i].name+"/";
    }
    return str;
}
export async function getFileContentAsText(filepath){
    const res = await fetch(filepath)
    return await res.text();
}
export async function deleteFiles(path,array,materialId,type='file',setProgress,total){
    const failed = [];
    for (let i = 0; i < array.length; i++) {
        if(array[i].selected && array[i].name !== 'folder_storing_purpose.txt'){
            const {res,data} = await deleteFileRequest(path+array[i].storedName,materialId,type)
            if(!res.ok)failed.push(array[i]);
            setProgress(prev=>prev+(60/total));
        }
    }
    return failed;
}