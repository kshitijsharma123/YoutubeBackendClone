import { Router } from 'express';
import {
    changeCurrentPassword,
    getCurrentUser,
    getUserChannelProfile,
    loginUser,
    logoutUer,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,

} from './../controllers/user.controller.js'

import { getVideos,uploadVideo, uploadFileVideo } from '../controllers/video.controller.js';

import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// testing video upload url have to remove it
router.route("/video").post(upload.single("video"), uploadFileVideo);

router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1,
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), registerUser)

router.route("/login").post(loginUser)

router.route("/c/:username/videos").get(getVideos)

router.route("/refresh-token").post(refreshAccessToken);


// secured routes (which required auth middleware)
router.use(verifyJWT);

router.route("/logout")
    .post(logoutUer);

router
    .route("/Change-Password")
    .post(changeCurrentPassword)

router
    .route("/update-Account")
    .post(updateAccountDetails);



router.
    route("/update-Avatar").
    post(upload.single("avatar"), updateAvatar)

router
    .route("/update-CoverImage")
    .post(upload.single('coverImage'), updateCoverImage)

router
    .route("/My-Profile")
    .get(getCurrentUser);

router
    .route("/c/:username")
    .get(getUserChannelProfile)


router.
    route("/upload-video").post(upload.fields([
        {
            name: "thumbnail",
            maxCount: 1 
        }, {
            name: "video",
            maxCount: 1
        }
    ]), uploadVideo);









export default router