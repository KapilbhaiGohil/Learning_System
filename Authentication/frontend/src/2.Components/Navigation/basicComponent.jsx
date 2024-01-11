import { useNavigate } from "react-router-dom"
import logo from "../../Assets/finalLogo.png"
export function Navbar({page}){
    const navigate = useNavigate();
    const changeNavigation = function(e){
        navigate(e.target.getAttribute('value'));
    }
    return(
        <>
            <nav>
                <div className={'nav-logo'}>
                    <img src={logo} alt={"Company logo"} width={"170px"}/>
                </div>
                <div className={'nav-links'}>
                    <ul>
                        <li onClick={changeNavigation} value={'home'} className={page==='home' ? 'selected':''}>Home</li>
                        {/* <li>Exampapers</li> */}
                        <li onClick={changeNavigation} value={'share-hub'} className={page==='share-hub' ? 'selected':''}>Share-Hub</li>
                        {/* <li className={page==='chat' && 'selected'}>Chat</li> */}
                        <li onClick={changeNavigation} value={'contact'} className={page==='contact' ? 'selected':''}>Contact Us</li>
                        {/* <li>Doubt</li> */}
                    </ul>
                </div>
            </nav>
        </>
    )
}