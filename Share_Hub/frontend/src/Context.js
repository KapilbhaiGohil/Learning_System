import {createContext, useEffect, useState} from "react";
import {Cookies} from "react-cookie";

export const Context = createContext(
    {
        activeUser: false,
        setActiveUser: () => {},
        isLoading:false,
        setIsLoading:()=>{},
        refresh:[],
        setRefresh:()=>{}
    }
)

export function ContextProvider({children}){
    const [isLoading,setIsLoading] = useState(false);
    const [refresh,setRefresh] = useState([]);
    const [activeUser,setActiveUser] = useState({});

    useEffect(()=>{
        console.log("get user  runned ")
        async function func(){
            const {res,data} = await getUser();
            if(res.ok){
                setActiveUser(data);
            }else{
                window.location.replace('http://localhost:3001/auth')
            }
        }
        func();
    },[])
    return(
        <Context.Provider value={{activeUser,setActiveUser,isLoading,setIsLoading,refresh,setRefresh}}>
            {children}
        </Context.Provider>
    )
}
const url = "http://localhost:8080";
async function getUser(){
    try{
        const cookies = new Cookies();
        const token = cookies.get('token');
        console.log(token);
        const res = await fetch(url+'/User/getUser',{
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