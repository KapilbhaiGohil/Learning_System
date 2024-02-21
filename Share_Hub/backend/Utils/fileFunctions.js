import {firebaseConfig} from './firebaseConfig.js'
import {deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytesResumable} from "firebase/storage";
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

        console.log('Upload completed successfully');
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}
export async function getDownloadUrlPath(cloudPath){
    return await getDownloadURL(ref(storage,cloudPath));
}
export async function deleteFolder(cloudPath){
    const storageRef = ref(storage,cloudPath);
    await deleteObject(storageRef);
}
export async function listFilesAndDirs(cloudPath){
    const storageRef = ref(storage,cloudPath)
    const listResult = await listAll(storageRef);
    const files=[],folders=[];
    for (const file of listResult.items) {
        let ext = path.extname(file.name);
        let originalName = file.name.slice(0,-24-ext.length)+ext;
        let url = await getDownloadURL(file);
        files.push({name:originalName,url:url});
    }
    listResult.prefixes.forEach((folder)=>{
        folders.push({name:folder.name,files:[],folders:[]});
    })
    return {files,folders};
}