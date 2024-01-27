
export const getMaterials = async()=>{
    try{
        const res = await fetch('/material/get',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
    }
}
export const createMaterial=async (bodyObj)=>{
    try{
        const res = await fetch('/material/create',{
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
        const res = await fetch('/material/like',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({materialId})
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
    }
}
export const removeLikeMaterial=async (materialId)=>{
    try{
        const res = await fetch('/material/removeLike',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({materialId})
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
    }
}