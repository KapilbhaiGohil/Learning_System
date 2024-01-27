import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Home from './1.views/home';
import {CreateMaterial, Navbar} from './2.components/globle';
import {ContextProvider} from "./Context";
import Material from "./1.views/material";

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
                </Routes>
            </Router>
        </ContextProvider>
    </>
  );
}

export default App;
