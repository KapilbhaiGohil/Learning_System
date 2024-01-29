export const getMaterialById=async (materialId)=>{
    try{
        const res = await fetch('/material/getMaterialById',{
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
export const uploadFile=async (formData)=>{
    try{
        const res = await fetch('/material/upload',{
            method:"POST",
            body:formData
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
    }
}
export const getFilesList=async (path)=>{
    try{
        const res = await fetch('/material/getFilesList',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({path})
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