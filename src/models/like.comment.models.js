import { Schema, model } from "mongoose";

const likeCommentSchema = new Schema({
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
}, { timestamps: true });

export const Likecomment = model("Likecomment", likeCommentSchema);
