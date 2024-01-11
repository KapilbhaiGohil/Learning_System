import { useOutletContext } from "react-router-dom";
import "../../../3.Styles/home.scss"
import { useEffect } from "react";
export default function Home(){
    const [page,setPage] = useOutletContext();
    useEffect(()=>{ setPage('home');},[])
    return(
        <>
            hello i am home page
        </>
    )
}