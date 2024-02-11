import {Cookies} from "react-cookie";

const url = "http://localhost:8080"
const cookies = new Cookies();
const token = cookies.get('token');
export const getMaterials = async()=>{
    try{
        const res = await fetch(url+'/material/get',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({token})
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
    }
}
export const createMaterial=async (bodyObj)=>{
    try{
        bodyObj.token = token;
        const res = await fetch(url+'/material/create',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(bodyObj)
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
    }
}
export const likeMaterial=async (materialId)=>{
    try{
        const res = await fetch(url+'/material/like',{
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
export const removeLikeMaterial=async (materialId)=>{
    try{
        const res = await fetch(url+'/material/removeLike',{
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