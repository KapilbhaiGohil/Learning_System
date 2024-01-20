import dotenv  from "dotenv";

dotenv.config({path:"../../config.env"})

export default {
    authPort:process.env.AUTH_PORT,
    authLocalDBUri:process.env.AUTH_LOCAL_DB_URI,
    jsonKey:process.env.JSONKEY,
    mailUser:process.env.MAILUSER,
    mailPass:process.env.MAILPASS,
    mode:process.env.MODE,
    maxRequestOtp:process.env.MAX_REQUEST_OTP,
}