import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Home from './1.views/home';
import { Navbar } from './2.components/globle';
function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='' element={<Home/>}></Route>
          <Route path='/home' element={<Home/>}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
