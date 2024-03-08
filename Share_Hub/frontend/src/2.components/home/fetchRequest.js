import {token, url} from "../globle";

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
        return {res: {ok:false},data: {e,msg:e.message}};
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
        return {res: {ok:false},data: {e,msg:e.message}};
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
        return {res: {ok:false},data: {e,msg:e.message}};
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
        return {res: {ok:false},data: {e,msg:e.message}};
    }
}
export const commentMaterial=async (materialId,msg)=>{
    try{
        const res = await fetch(url+'/material/addComment',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({materialId,token,msg})
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
        return {res: {ok:false},data: {e,msg:e.message}};
    }
}
export const getComments = async (materialId)=>{
    try{
        const res = await fetch(url+'/material/getComments',{
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

export const joinMaterialRequest = async (materialCode)=>{
    try{
        const res = await fetch(url+'/material/addMaterial',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({materialCode,token})
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
        return {res: {ok:false},data: {e,msg:e.message}};
    }
}
export const deleteMaterialReq=async (materialId)=>{
    try{
        const res = await fetch(url+'/material/deleteMaterial',{
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
export const leaveMaterialReq=async (materialId)=>{
    try{
        const res = await fetch(url+'/material/leaveMaterial',{
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
