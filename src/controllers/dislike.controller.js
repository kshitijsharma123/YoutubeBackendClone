import { asyncHandler } from "./../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Likevideo } from "../models/like.video.model.js";
import { Dislikevideo } from "../models/dislike.video.model.js";
import { Likecomment } from "../models/like.comment.models.js";

export const toggleVideoDislike = asyncHandler(async (req, res) => {
  const { _id } = req.user[0];
  const { id } = req.params;
  let disliked;
 

  if (!id) throw new ApiError(400, "No Video id given");

  try {
    const existingLike = await Likevideo.findOne({ video: id, likedBy: _id });
    const existingDislike = await Dislikevideo.findOne({
      video: id,
      dislikedBy: _id,
    });

    if (existingLike) {
      const deleteLike = await Likevideo.findOneAndDelete({
        video: id,
        likedBy: _id,
      });
      if (deleteLike) {
        await Dislikevideo.create({ video: id, dislikedBy: _id });
      }
      disliked = true;
      

      const likeCount = await Likevideo.countDocuments({ video: id });

      res
        .status(200)
        .json(
          new ApiResponse(200, { disliked, likeCount }, "Disliked the video and removed like")
        );
    } else if (existingDislike) {
      await Dislikevideo.findOneAndDelete({ video: id, dislikedBy: _id });
      disliked = false;

      const likeCount = await Likevideo.countDocuments({ video: id });

      res
        .status(200)
        .json(
          new ApiResponse(200, { disliked, likeCount }, " removed Disliked from the  video")
        );
    } else {
      await Dislikevideo.create({ video: id, dislikedBy: _id });
      disliked = true;

      const likeCount = await Likevideo.countDocuments({ video: id });
      res
        .status(200)
        .json(
          new ApiResponse(200, { disliked, likeCount }, "Disliked the video")
        );
    }
  } catch (error) {
    console.error("Error toggling video dislike:", error);
    res.status(500).json(new ApiResponse(500, {}, "Internal Server Error"));
  }
});
