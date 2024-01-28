import {firebaseConfig} from './firebaseConfig.js'
import {deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytesResumable} from "firebase/storage";
import {initializeApp} from 'firebase/app'
import fs from 'fs'
import path from 'path'
initializeApp(firebaseConfig);
const storage = getStorage();

export async function uploadFiles(files,cloudPath){
    let urls = [];
    for (let i = 0; i < files.length; i++) {
        const fileBuffer = fs.readFileSync(files[i].path)
        const storageRef = ref(storage,cloudPath+files[i].filename);
        const uploadTask = await uploadBytesResumable(storageRef,fileBuffer,{contentType:files[i].mimetype})
        urls.push(await getDownloadURL(storageRef));
    }
    return urls;
}
export async function uploadFile(file,cloudPath){
    const fileBuffer = fs.readFileSync(file.path)
    const storageRef = ref(storage,cloudPath+file.filename);
    const uploadTask = await uploadBytesResumable(storageRef,fileBuffer,{contentType:file.mimetype})
}
export async function deleteFolder(cloudPath){
    const storageRef = ref(storage,cloudPath);
    await deleteObject(storageRef);
}
export async function listFilesAndDirs(cloudPath){
    const storageRef = ref(storage,cloudPath)
    const listResult = await listAll(storageRef);
    const files=[],folders=[];
    listResult.items.forEach((file)=>{
        let ext = path.extname(file.name);
        let originalName = file.name.slice(0,-24-ext.length)+ext;
        files.push(originalName);
    })
    listResult.prefixes.forEach((folder)=>{
        folders.push(folder.name);
    })
    return {files,folders};
}