    import {BrowserRouter as Router, createBrowserRouter, Route, Routes} from 'react-router-dom'
    import Home from './1.views/home';
    import { Navbar} from './2.components/globle';
    import {ContextProvider} from "./Context";
    import Material from "./1.views/material";
    import "./3.styles/globle.scss"
    import "./3.styles/Media Query/media.scss"
    import Settings from "./1.views/settings";
    function App() {
      return (
        <>
            <ContextProvider>
                <Router>
                    <Navbar/>
                    <Routes>
                        <Route path='' element={<Home />}></Route>
                        <Route path='/home' element={<Home/>}></Route>
                        <Route path={'/material/:id'} element={<Material/>}></Route>
                        <Route path={'/settings'} element={<Settings/>}></Route>
                    </Routes>
                </Router>
            </ContextProvider>
        </>
      );
    }
    export default App;
