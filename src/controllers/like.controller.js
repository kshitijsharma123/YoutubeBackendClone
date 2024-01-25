import { asyncHandler } from './../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Like } from "./../models/like.model.js";


// Later create a single function  

export const toggleVideoLike = asyncHandler(async (req, res) => {



    const { _id } = req.user[0];
    const { id } = req.params; // video id

    const existingLike = await Like.findOne({ video: id, likedBy: _id });
    try {

        if (existingLike) {
            await Like.findOneAndDelete({ video: id, likedBy: _id })

        } else {
            await Like.create({
                video: id,
                likedBy: _id
            })
        }


        const likeCount = await Like.countDocuments({ video: id });


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

    const existingLike = await Like.findOne({ comment: id, likedBy: _id });
    try {

        if (existingLike) {
            await Like.findOneAndDelete({ comment: id, likedBy: _id })

        } else {
            await Like.create({
                comment: id,
                likedBy: _id
            })
        }


        const likeCount = await Like.countDocuments({ comment: id });


        res.status(200).json(
            new ApiResponse(200, { likeCount }, "Success")
        )

    } catch (error) {
        throw new ApiError(404, error)
    }
})