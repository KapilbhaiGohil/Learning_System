import {createContext, useEffect, useState} from "react";

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

async function getUser(){
    try{
        const res = await fetch('/User/getUser',{
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