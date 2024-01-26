import { asyncHandler } from './../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Comment } from './../models/comment.model.js';

export const addComment = asyncHandler(async (req, res) => {

    const { _id } = req.user[0];
    const { content } = req.body;
    const { id } = req.params;

    if (!id) throw new ApiError(403, "video Id not provided");

    const comment = await Comment.create({
        video: id,
        content,
        commentBy: _id
    })
    if (!comment) throw new ApiError(500, "Server Error. Try Later");

    res.status(201).json(new ApiResponse(201, { comment }, "Success"))


})

export const getVideoComment = asyncHandler(async (req, res) => {

    const { id } = req.params;
    if (!id) throw new ApiError(403, "ERROR: No Video id provided");
    const videoComments = await Comment.find({ video: id });

    if (!videoComments) res.status(200).json(new ApiResponse(200, { "result": "No Comments" }, "Suceess"));
    const numberOfComment = videoComments.length;
    res.status(200).json(new ApiResponse(200, { numberOfComment, videoComments }, "Success"))

})