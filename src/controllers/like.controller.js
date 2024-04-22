import { asyncHandler } from "./../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Likevideo } from "../models/like.video.model.js";
import { Likecomment } from "../models/like.comment.models.js";
import { Dislikevideo } from "../models/dislike.video.model.js";


export const toggleVideoLike = asyncHandler(async (req, res) => {
  const { _id } = req.user[0];
  const { id } = req.params; 
  let liked 

  if (!id) throw new ApiError(400, "No Video id given");

  try {
    const existingDislike = await Dislikevideo.findOne({
      video: id,
      dislikedBy: _id,
    });
    const existingLike = await Likevideo.findOne({ video: id, likedBy: _id });

    if (existingDislike) {
      await Dislikevideo.findOneAndDelete({
        video: id,
        dislikedBy: _id,
      });
      await Likevideo.create({
        video: id,
        likedBy: _id,
      });
      liked = true; 
    } else if (existingLike) {
      await Likevideo.findOneAndDelete({
        video: id,
        likedBy: _id,
      });
      liked = false;
    } else {
      await Likevideo.create({
        video: id,
        likedBy: _id,
      });
      liked = true; 
    }

    const likeCount = await Likevideo.countDocuments({ video: id });

    res.status(200).json(new ApiResponse(200, { likeCount, liked }, "Success"));
  } catch (error) {
    throw new ApiError(404, error);
  }
});

export const toggleCommentLike = asyncHandler(async (req, res) => {
  const { _id } = req.user[0];
  const { id } = req.params; // comment id

  if (!id) throw new ApiError(400, "No comment id given");

  const existingLike = await Likecomment.findOne({ comment: id, likedBy: _id });
  try {
    if (existingLike) {
      await Likecomment.findOneAndDelete({ comment: id, likedBy: _id });
    } else {
      await Likecomment.create({
        comment: id,
        likedBy: _id,
      });
    }

    const likeCount = await Likecomment.countDocuments({ comment: id });

    res.status(200).json(new ApiResponse(200, { likeCount }, "Success"));
  } catch (error) {
    throw new ApiError(404, error);
  }
});

export const getlikedVideos = asyncHandler(async (req, res) => {
  const { _id } = req.user[0];

  const likedVideos = await Likevideo.find({ likedBy: _id })
    .populate("video")
    .select("-_id -likedBy -createdAt -updatedAt -__v");

  const numberOfLikedVideos = await Likevideo.countDocuments({ likedBy: _id });

  res
    .status(200)
    .json(
      new ApiResponse(200, { numberOfLikedVideos, likedVideos }, "Success")
    );
});

export const isLiked = asyncHandler(async (req, res) => {
  const { _id } = req.user[0];
  const { id } = req.params;

  if (!id) throw new ApiError(400, "No comment id given");
  try {
    const like = await Likevideo.findOne({ likedBy: _id, video: id });
    const dislike = await Dislikevideo.findOne({ dislikedBy: _id, video: id });
    const likeCount = await Likevideo.countDocuments({ video: id });

    if (like) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { Liked: true, Disliked: false, likeCount },
            "Response send"
          )
        );
    } else if (dislike) {
console.log("Dislike true")
      return res
        .status(200)
        .json(
          new ApiResponse(200, { Liked: false, Disliked: true, likeCount })
        );
    } else {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { Liked: false, Disliked: false, likeCount },
            "Response send"
          )
        );
    }
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiResponse(
          500,
          { message: "Internal server error" },
          "Internal server errror"
        )
      );
  }
});
