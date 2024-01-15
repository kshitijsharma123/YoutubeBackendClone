import { Schema, model } from "mongoose";
import mongooseAgregate from "mongoose-paginate"

const videoSchema = new Schema({

    videoFile: {
        type: String, //url
        required: true
    },
    title: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String,
        required: true,

    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false
    }
    , duration: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true })


export const Video = model("Video", videoSchema)