import {firebaseConfig} from './firebaseConfig.js'
import mimeTypes from 'mime-types';
import path from 'path';
import {deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import {initializeApp} from 'firebase/app'
import fs from 'fs'
initializeApp(firebaseConfig);
const storage = getStorage();

export async function uploadFile(localPath,cloudPath,file){
    const fileExtension = path.extname(file.originalname).toLowerCase();
    let mimeType = mimeTypes.lookup(fileExtension)
    const storageRef = ref(storage,cloudPath);
    const fileBuffer = fs.readFileSync(localPath)
    const snapshot = await uploadBytesResumable(storageRef,fileBuffer,{contentType:mimeType})
    return await getDownloadURL(storageRef);
}
export async function deleteFolder(cloudPath){
    const storageRef = ref(storage,cloudPath);
    await deleteObject(storageRef);
}