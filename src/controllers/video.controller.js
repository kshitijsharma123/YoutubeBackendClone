import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";

import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const uploadVideo = asyncHandler(async (req, res) => {

    const { title, description } = req.body;
    const { _id } = req.user[0];


    if (title === "" || description === "") throw new ApiError(401, "Title and description are required");

    const thumbnailLocalpath = req.files?.thumbnail[0]?.path;
    const videoLocalPath = req.files?.video[0]?.path;



    if (!thumbnailLocalpath || !videoLocalPath) throw new ApiError(500, "Error while saving thumbnail or video");

    // ***** ADD feature not upload video more than 100 mb 
    if (bytesToMB(req.files?.video[0].size) > 99) throw new ApiError(402, "Can not upload video more than 100mb ");

    const thumbnail = await uploadFileOnCloudinary(thumbnailLocalpath);
    const video = await uploadFileOnCloudinary(videoLocalPath);

    if (!thumbnail) throw new ApiError(500, "Server error while saving cloudinary thumbnail");
    if (!video) throw new ApiError(500, "Server error while saving cloudinary video");

    const saveVideo = await Video.create({
        videoFile: video.url,
        title,
        description,
        owner: _id,
        thumbnail: thumbnail.url,
        duration: video.duration

    })

    res.status(201)
        .json(new ApiResponse(201, saveVideo, "Vidio is uploaded Sccussfully"))



})


function bytesToMB(bytes) {
    let kitoBytes = bytes / 1024;
    let megaBytes = kitoBytes / 1024;
    return megaBytes
}

export const uploadFileVideo = async (req, res) => {

    console.log("uploadin......")
    const videoLocalPath = req.file?.path;
    console.log({ bytes: req.file?.size, MB: bytesToMB(req.file.size) });




    const vidio = await uploadFileOnCloudinary(videoLocalPath)

    console.log(vidio);
    console.log("\n\n\nUpload done........")

}
