import { v2 as cloudinary } from 'cloudinary'
import { response } from 'express';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUD,
    api_secret: process.env.API_SECRET_CLOUD
})


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload file on cloudinary
        cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfull
        console.log("File is uploaded", response.url)

        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log("ERROR in File Upload on CLoudinary ", error)
        return null
    }
}


export { uploadOnCloudinary }
