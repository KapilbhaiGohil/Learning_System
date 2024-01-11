import { Outlet } from "react-router-dom";
import "../3.Styles/auth.scss"
import logo from "../Assets/finalLogo.png"
export default function Auth(){
    return(
        <>
            <div className="auth">
                <div className="auth-outer">
                    <div className="auth-logo">
                        <img src={logo} width={"200px"} alt="logo"/>
                    </div>
                    <div className="auth-content">
                        <Outlet></Outlet>
                    </div>
                </div>
            </div>
        </>
    )
}