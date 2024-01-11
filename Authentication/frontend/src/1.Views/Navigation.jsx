import { Outlet } from "react-router-dom";
import {Navbar} from "../2.Components/Navigation/basicComponent";
import { useState } from "react";

export default function Navigation(){
    const [page,setPage] = useState('');
    return(
        <>
            <Navbar page={page}/>
            <Outlet context={[page,setPage]}/>
        </>
    )
}