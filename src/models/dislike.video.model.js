import { Schema, model } from "mongoose";

const dislikeVideoScheme = new Schema({

    dislikedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
   


}, { timestamps: true });


export const Dislikevideo = model("Dislikevideo", dislikeVideoScheme);