import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"

export default function ShareHub(){
    const [page,setPage] = useOutletContext();
    useEffect(()=>{ setPage('share-hub');},[])
    return (
        <>
            i am sharehub page
        </>
    )
}