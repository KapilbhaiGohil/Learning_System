import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export default function ContactUs(){
    const [page,setPage] = useOutletContext();
    useEffect(()=>{ setPage('contact');},[])
    return (
        <>
            i am contact page
        </>
    )
}