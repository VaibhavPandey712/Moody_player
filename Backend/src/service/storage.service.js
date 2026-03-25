import ImageKit from "imagekit";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

var imageKit=new ImageKit({
    publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT
})

function uploadFile(file){
    return new Promise((resolve,reject)=>{
        imageKit.upload({
            file:file.buffer,
            fileName:(new mongoose.Types.ObjectId()).toString(),
            folder:"cohort-folder"
        },(error,result)=>{
            if(error){
                reject(error);
            }else{
                resolve(result);
            }
        })
    })
}
export default uploadFile;