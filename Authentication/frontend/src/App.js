import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Auth from "./1.Views/auth";
import ForgotPassword, { ForgotPassSuccess } from "./2.Components/auth/forgotpass";
import Login from "./2.Components/auth/login";
import Register, {Success} from "./2.Components/auth/register";
import OtpVerification from "./2.Components/auth/otpVerification";
import Home from "./2.Components/Navigation/Home/home";
import ForgoPassVerification from "./2.Components/auth/forgotPassVerification";
import Navigation from "./1.Views/Navigation";
import ShareHub from "./2.Components/Navigation/ShareHub/ShareHub";
import ContactUs from "./2.Components/Navigation/ContactUs/ContactUs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigation/>}>
          <Route path={'/home'} index element={<Home/>}></Route>
          <Route path={'/share-hub'} element={<ShareHub/>}></Route>
          <Route path={'/contact'} element={<ContactUs/>}></Route>
        </Route>

        {/* auth route */}
        <Route path="/auth" element={<Auth/>}>
          <Route index element={<Login/>}></Route>
          <Route path="register" element={<Register/>}>
            <Route path="verify-email" element={<OtpVerification/>}></Route>
            <Route path={"success"} element={<Success/>}></Route>
          </Route>
          <Route path="forgot-pass" element={<ForgotPassword/>}>
            <Route path="verify-email" element={<ForgoPassVerification/>}></Route>
            <Route path={"success"} element={<ForgotPassSuccess/>}></Route>
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;