import {firebaseConfig} from './firebaseConfig.js'
import {
    deleteObject,
    getDownloadURL, getMetadata,
    getStorage,
    listAll,
    ref,
    uploadBytesResumable,
    uploadString
} from "firebase/storage";
import {initializeApp} from 'firebase/app'
import fs from 'fs'
import path from 'path'

initializeApp(firebaseConfig);
const storage = getStorage();

export async function uploadFile(file,cloudPath){
    try {
        const fileBuffer = fs.readFileSync(file.path);
        const storageRef = ref(storage, cloudPath + file.filename);
        const uploadTaskSnapshot = await uploadBytesResumable(storageRef, fileBuffer, { contentType: file.mimetype });
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}
export async function createFolder(cloudPath){
        let folderRef = ref(storage,cloudPath);
        const files = await listAll(folderRef);
        if(files.items.length>0){
            return {ok:false,msg:"Folder already exist. try with another name or delete existing folder."};
        }else{
            cloudPath+=`/folder_storing_purpose.txt`;
            let folderRef = ref(storage,cloudPath);
            await uploadString(folderRef,"keep");
            return {ok:true,msg:"folder created successfully."};
        }
}
export async function getDownloadUrlPath(cloudPath){
    return await getDownloadURL(ref(storage,cloudPath));
}
async function helper(cloudpath,root){
    const listResult = await listAll(ref(storage,cloudpath));
    let failed = [];
    for(const file of listResult.items){
        try{
            await deleteObject(ref(storage,cloudpath+'/'+file.name));
        }catch (e) {
            console.log(e);
            failed.push(cloudpath+'/'+file.name);
        }
    }
    for (const folder of listResult.prefixes){
        let temp = await helper(cloudpath+'/'+folder.name,root);
        failed = [...failed,...temp];
    }
    return failed;
}
export async function deleteFolder(cloudPath){
    const failed = await helper(cloudPath,cloudPath);
    return failed;
}
export async function deleteFile(cloudPath,fileName){
    try{
        const storageRef = ref(storage,cloudPath+`/${fileName}`);
        const temp = await deleteObject(storageRef)
        const info = await checkFileExistense(cloudPath+'folder_storing_purpose.txt');
        if(!info.ok && !info.e){
            await uploadString(ref(storage,cloudPath+'folder_storing_purpose.txt'),"keep");
        }
        return {ok:true};
    }catch (e) {
        return {ok:false,msg:e.message,error:e};
    }
}
export async function listFilesAndDirs(cloudPath){
    const storageRef = ref(storage,cloudPath)
    const listResult = await listAll(storageRef);
    const files=[],folders=[];
    for (const file of listResult.items) {
        let ext = path.extname(file.name);
        let originalName = file.name;
        if(file.name!==`folder_storing_purpose.txt`)originalName = originalName.slice(0,-24-ext.length)+ext;
        let url = await getDownloadURL(file);
        files.push({name:originalName,storedName:file.name,url:url});
    }
    listResult.prefixes.forEach((folder)=>{
        folders.push({name:folder.name,storedName:folder.name,files:[],folders:[]});
    })
    return {files,folders};
}
async function checkFileExistense(filePath){
    try{
        await getMetadata(ref(storage,filePath));
        return {ok:true,e:false};
    }catch (e) {
        if (e.code === 'storage/object-not-found') {
            return {ok:false,e:false};
        }
        console.error("Error checking file existence:", e);
        return {ok:false,e:true};
    }
}