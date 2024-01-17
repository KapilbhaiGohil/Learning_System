import "../3.styles/globle.scss"
import logo from "../5.assets/finalLogo.png"
export function Navbar(){
    return (
        <>
            <nav>
                <div className="nav-div">
                    <div className={'nav-logo'}>
                        <img src={logo} width={"170px"} alt="logo" />
                    </div>
                    <div className="nav-heading">Share Hub</div>
                </div>
                <div className={"nav-links"}>
                    <ul>
                        <li>Get Material</li>
                        <li>Create Material</li>
                    </ul>
                </div>
            </nav>
        </>
    )
}