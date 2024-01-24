import { Schema, model } from "mongoose";

const likeScheme = new Schema({

    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    }


}, { timestamps: true });


export const Like = model("Like", likeScheme);