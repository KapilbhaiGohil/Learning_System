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
    }
}
export const uploadFile=async (formData)=>{
    try{
        const res = await fetch(url+'/material/upload',{
            method:"POST",
            body:formData
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
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