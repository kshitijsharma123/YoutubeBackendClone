import { Schema, model } from "mongoose";

const likeCommentScheme = new Schema({

    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },



}, { timestamps: true });


export const Likecomment = model("likecomment", likeCommentScheme);