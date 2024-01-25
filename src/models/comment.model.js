import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        commentBy: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        content: {
            type: String,
            require: true
        }
    }
    , { timestamps: true })

export const Comment = model("Comment", commentSchema);