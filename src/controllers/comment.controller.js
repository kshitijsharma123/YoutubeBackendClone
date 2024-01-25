import { asyncHandler } from './../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Comment } from './../models/comment.model.js';

export const addComment = asyncHandler(async (req, res) => {

    const { _id } = req.user[0];
    const { content } = req.body;
    const { id } = req.params;

    const comment = await Comment.create({
        video: id,
        content,
        commentBy: _id
    })
    if (!comment) throw new ApiError(500, "Server Error. Try Later");

    res.status(201).json(new ApiResponse(201, { comment }, "Success"))






})