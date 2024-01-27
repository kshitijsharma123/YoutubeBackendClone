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

    // This Query find comments on videos the remove fields like _id updateAt and __v the populate commentBy(userModel) and  only show username and avatar of the user ** Added a Better Solution Later **

    const videoComments = await Comment.find({ video: id })
        .select(' -updatedAt -__v')
        .populate({
            path: 'commentBy'
            , select: 'username avatar -_id'
        })


    if (!videoComments) res.status(200).json(new ApiResponse(200, { "result": "No Comments" }, "Suceess"));

    const numberOfComment = videoComments.length;

    res.status(200).json(new ApiResponse(200, { numberOfComment, videoComments }, "Success"))

})

export const updateComment = asyncHandler(async (req, res) => {

    const { _id } = req.user[0];
    console.log(_id)
    const { id } = req.params;
    const { content } = req.body;

    if (!id || !content) throw new ApiError(401, " Comment id or content of the commnet is not provided ");

    const comment = await Comment.findById(id);

    if (!comment) throw new ApiError(400, "No comment with this id");


    if (_id.toString() !== comment.commentBy.toString()) throw new ApiError(403, "Can not Edit a Commnet which is not by you ");

    comment.content = content;

    const resSave = await comment.save({ validateBeforeSave: false });

    if (!resSave) throw new ApiError(500, "Server ERROR");

    res.status(202).json(new ApiResponse(200, { resSave }, "Comment Updated"));

})