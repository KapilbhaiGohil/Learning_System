import dotenv  from "dotenv";

dotenv.config({path:"../../config.env"})

export default {
    shareHubLocalDbUri:process.env.SHAREHUB_LOCAL_DB_URI,
    shareHubPort:process.env.SHAREHUB_PORT,
    authHost:process.env.AUTH_HOST,
    authDomain:process.env.AUTH_DOMAIN,
    rootFolderId:process.env.ROOT_FOLDER_ID
}