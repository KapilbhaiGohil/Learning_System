import {token, url} from "../globle";
export const setOrGetAccessReq=async (accessInfo,set)=>{
    try{
        const res = await fetch(url+'/user/fetchOrSetAccess',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({set,token,accessInfo})
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
        return {res: {ok:false},data: {e,msg:e.message}};
    }
}