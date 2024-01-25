import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFileOnCloudinary, deleteVideoFileOnCloudinary, uploadFileOnCloudinary } from "../utils/cloudinary.js";

import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

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

export const getVideos = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if (!username?.trim()) throw new ApiError(400, "username missing");




    // const videos = await User.aggregate([
    //     { $match: { username: username } },
    //     {
    //       $lookup: {
    //         from: 'videos',
    //         localField: "_id",
    //         foreignField: "owner",
    //         as: "uploadedVideos"
    //       }
    //     }
    //   ]);

    //   console.log(videos);


    // *** Do this using Aggerate pipeline ******

    const { _id } = await User.findOne({ username });
    const videos = await Video.find({ owner: _id })

    res.status(200).json(new ApiResponse(200, videos, "Videos send successfully"));




})



//  http://localhost:8000/api/v1/videos?title=guitar

export const searchVideos = asyncHandler(async (req, res) => {

    const { title, sort } = req.query;

    if (!title) throw new ApiError(404, "Bad request in searchVideos ");

    let sortOptions = { views: 1 };

    if (sort) {

        const fixedSortStr = sort.replace(/\s/g, '');


        if (fixedSortStr === "date") {
            sortOptions = { ...sortOptions, createdAt: 1 };
        } else if (fixedSortStr === "-date") {
            sortOptions = { ...sortOptions, createdAt: -1 }
        } else if (fixedSortStr === "-views") {
            sortOptions = { views: -1 }
        }

    }

    const searchedVideos = await Video.find(
        {
            title: { $regex: new RegExp(title, "i") }

        }).select(" -updatedAt").sort(sortOptions)
        .limit(10)


    res.status(200)
        .json(new ApiResponse(200, searchedVideos, 'searched!!'))

})

//** URL ** /videos/delete/:id

export const deleteVideo = asyncHandler(async (req, res) => {
    // 1) User in login
    // 2) Check if the video belongs to the user;
    // 3) delete videofile and thumbnail file from clodinary server 
    // 4)  delete video doc in mongodb
    // 5) send res to the useri

    const { id } = req.params;
    const { _id } = req.user[0]

    const { owner, thumbnail, videoFile } = await Video.findById(id);

    if (_id === owner) throw new ApiError(401, "Can not delete a file which is not uploaded by you");

    const deleteV = await deleteVideoFileOnCloudinary(videoFile);
    const deleteT = await deleteVideoFileOnCloudinary(thumbnail);

    if (deleteV === false) throw new ApiError(500, "Problem Deleting Video, Try later server error");
    if (deleteT === false) throw new ApiError(500, "Problem Deleting thumbnail, Try later server error");

    const deleteVideoDoc = await Video.findByIdAndDelete(id);
    if (!deleteVideoDoc) throw new ApiError(500, "ERROR deleting video doc on mongodb")


    return res.status(200).json(new ApiResponse(200, {}, "Video is deleted"));
})

export const isPublishedStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;

    try {

        const video = await Video.findById(id);

        if (!video) throw new ApiError(404, "No video found")

        video.isPublished = !video.isPublished;

        await video.save({ validateBeforeSave: false });
        res.status(201).json(new ApiResponse(201, {}, "Success"));

    } catch (error) {

        console.log({ error })
    }

})

export const UpdateVideos = asyncHandler(async (req, res) => {

    const { title, description } = req.body
    const { id } = req.params;
    const { _id } = req.user[0];

    const video = await Video.findById(id);

    if (_id === video.owner) throw new ApiError(404 < "Can not edit a video which is not uploaded by you")

    if (!title && !description) throw new ApiError(401, "atlest one field is required");



    if (title && description) {
        video.title = title;
        video.description = description;
    } else if (title) {
        video.title = title;

    } else if (description) {
        video.description = description;

    }

    video.save({ validateBeforeSave: false });


    return res.status(202).json(new ApiResponse(201, {}, "Success"));


})

export const updatethumbnail = asyncHandler(async (req, res) => {

    const thumbnailLocalPath = req.file?.path;
    const { id } = req.params
    const { _id } = req.user[0];

    const video = await Video.findById(id);

    if (_id === video.owner) throw new ApiError(404 < "Can not edit a video which is not uploaded by you")
    if (!thumbnailLocalPath) throw new ApiError(500, "Server error while saving thumbnail");

    const { url } = await uploadFileOnCloudinary(thumbnailLocalPath);

    if (!url) throw new ApiError(500, "File not saved in cloudinary server");

    const fileDelele = await deleteFileOnCloudinary(video.videoFile);

    if (!fileDelele === false) throw new ApiError(500, "Internal Server error while delete old thumnail")

    video.thumbnail = url;
    video.save({ validateBeforeSave: false })

return  res.status(202).json(new ApiResponse(202, {}, "Success"))

})