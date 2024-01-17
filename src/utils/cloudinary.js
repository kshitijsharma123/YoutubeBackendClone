import { triggerAsyncId } from 'async_hooks';
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUD,
    api_secret: process.env.API_SECRET_CLOUD
})


const uploadFileOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfull

        fs.unlinkSync(localFilePath)

        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log("ERROR in File Upload on CLoudinary ", error)
        return null
    }
}


const deleteFileOnCloudinary = async (avatarURL) => {
    try {

        const urlParts = avatarURL.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const public_id = filenameWithExtension.replace(/\.[^/.]+$/, '');
        await cloudinary.uploader.destroy(public_id);

    } catch (error) {
        console.log("ERROR While deleting the file on CLoudinary\n\n\n\n", error);
    }
}




export { uploadFileOnCloudinary, deleteFileOnCloudinary }
