import fs from "fs"
import {google} from 'googleapis'
import apikey from "./apikeys.json" assert {type:'json'}
import * as path from "path";

const SCOPE = ['https://www.googleapis.com/auth/drive'];

async function authorize(){
    const jwtclient = new google.auth.JWT(
        apikey.client_email,
        null,
        apikey.private_key,
        SCOPE
    );
    await jwtclient.authorize()
    return jwtclient;
}
export async function uploadFile(filePath,fileName,driveFolderId){
    try{
        const auth = await authorize();
        const drive = google.drive({version:"v3",auth});
        const fileContent = fs.createReadStream(filePath);
        const mimeType = getMimeType(filePath);
        const fileMetaData = {
            name:fileName,
            parents:[driveFolderId]
        }
        const media={
            mimeType:mimeType,
            body:fileContent
        }
        const file = await drive.files.create({
            resource:fileMetaData,
            media:media
        });
        return file.data.id;
    }catch (e) {
        console.log(e);
        return null;
    }
}
export async function createFolder(folderName,parentFolderId){
    try{
        const auth = await authorize();
        const drive = google.drive({version:"v3",auth});
        const folderMetadata = {
            name:folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents:[parentFolderId]
        }
        const folder = await drive.files.create({
            resource:folderMetadata,
            fields:'id',
        })
        return folder.data.id;
    }catch (e){
        console.log(e);
        return null;
    }
}
export async function deleteFile(fileId){
    try{
        const auth = await authorize();
        const drive = google.drive({version:"v3",auth});
        const res = await drive.files.delete({
            fileId:fileId
        });
        return res.status === 204;
    }catch (e) {
        console.log(e);
        return false;
    }
}
function getMimeType(filePath) {
    const extension = path.extname(filePath).toLowerCase();

    switch (extension) {
        case '.mp3':
            return 'audio/mp3';
        case '.pdf':
            return 'application/pdf';
        case '.txt':
            return 'text/plain';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.ppt':
        case '.pptx':
            return 'application/vnd.ms-powerpoint';
        case '.doc':
        case '.docx':
            return 'application/msword';
        case '.mp4':
            return 'video/mp4';
        // Add more cases as needed
        default:
            return 'application/octet-stream'; // Default MIME type for unknown file types
    }
}