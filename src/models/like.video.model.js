import { Schema, model } from "mongoose";

const likeVideoScheme = new Schema({

    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
   


}, { timestamps: true });


export const Likevideo = model("Likevideo", likeVideoScheme);