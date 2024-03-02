import {token,url} from "../globle";

export async function searchUserByEmail(searchEmail,materialId){
    try{
        const res = await fetch(url+'/user/searchUser',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({searchEmail,token,materialId})
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
        return {res: {ok:false},data: {e,msg:e.message}};
    }
}
export async function sendInvitationReq(peoples,materialId){
    try{
        const res = await fetch(url+'/material/sendInvitation',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({peoples,materialId,token})
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
        return {res: {ok:false},data: {e,msg:e.message}};
    }
}
export async function fetchNotificationReq(){
    try{
        const res = await fetch(url+'/material/getNotifications',{
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
export async function sendResposeForInvitationReq(joined=false,notificationId){
    try{
        const res = await fetch(url+'/material/responseForInvitation',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({token,joined,notificationId})
        });
        const data = await res.json();
        return {res,data};
    }catch (e) {
        console.log(e);
        return {res: {ok:false},data: {e,msg:e.message}};
    }
}