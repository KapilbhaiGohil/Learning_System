import {firebaseConfig} from "./firebaseConfig.js";
import {initializeApp} from 'firebase/app';
import {getStorage,uploadBytesResumable,ref} from 'firebase/storage'
import fetch from "node-fetch";
import fs from "fs";


initializeApp(firebaseConfig);
const storage = getStorage();

export async function generateAndUploadProfilePic(user){
    try{
        let imageBuff ;
        const res = await fetch(`https://ui-avatars.com/api/?rounded=true&name=${user.name} &background=random&size=128&font-size=0.5`,{
            method:'GET',
        });
        if(res.ok){
            imageBuff = await res.arrayBuffer();
        }else{
            imageBuff = fs.readFileSync('../uploads/defaultPic.png');
        }
        let cloudPath = user._id + '/profilePic.png';
        const storageRef = ref(storage,cloudPath);
        const uploadTask = await uploadBytesResumable(storageRef,imageBuff,{contentType:"image/jpeg"})
        return {status:'successfull'};
    }catch (e){
        console.log(e);
        return {status:'failed',error:e};
    }
}
