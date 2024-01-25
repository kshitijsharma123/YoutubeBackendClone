import { asyncHandler } from './../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Likevideo } from "../models/like.video.model.js";
import {Likecomment} from '../models/like.comment.models.js'

// Later create a single function  

export const toggleVideoLike = asyncHandler(async (req, res) => {



    const { _id } = req.user[0];
    const { id } = req.params; // video id

    if (!id) throw new ApiError(400, "No Video id given");


    const existingLike = await Likevideo.findOne({ video: id, likedBy: _id });
    try {

        if (existingLike) {
            await Likevideo.findOneAndDelete({ video: id, likedBy: _id })

        } else {
            await Likevideo.create({
                video: id,
                likedBy: _id
            })
        }


        const likeCount = await Likevideo.countDocuments({ video: id });


        res.status(200).json(
            new ApiResponse(200, { likeCount }, "Success")
        )

    } catch (error) {
        throw new ApiError(404, error)
    }
})

export const toggleCommentLike = asyncHandler(async (req, res) => {



    const { _id } = req.user[0];
    const { id } = req.params; // comment id

    if (!id) throw new ApiError(400, "No comment id given");

    const existingLike = await Likecomment.findOne({ comment: id, likedBy: _id });
    try {

        if (existingLike) {
            await Likecomment.findOneAndDelete({ comment: id, likedBy: _id })

        } else {
            await Likecomment.create({
                comment: id,
                likedBy: _id
            })
        }


        const likeCount = await Likecomment.countDocuments({ comment: id });


        res.status(200).json(
            new ApiResponse(200, { likeCount }, "Success")
        )

    } catch (error) {
        throw new ApiError(404, error)
    }
})

export const getlikedVideos = asyncHandler(async (req, res) => {

    const { _id } = req.user[0];

    // const likedVideos = await Like.aggregate([
    //     { $match: { likedBy: _id } },
    //     {
    //         $lookup: {
    //             from: 'videos',
    //             localField: "video",
    //             foreignField: "_id",
    //             as: "likedVideos"
    //         }
    //     }, {
    //         $addFields: {
    //             likedVideosCount: {
    //                 $size: "likedVideos"
    //             }
    //         }
    //     }, {
    //         $project: {
    //             likedVideosCount: 1
    //         }
    //     }

    // ])

    const a = await Like.find({ likedBy: _id });
    console.log(a)

    res.status(200).send('<h1>Working</h1>')

})