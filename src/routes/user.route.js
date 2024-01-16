import { Router } from 'express';
import { changeCurrentPassword, loginUser, logoutUer, refreshAccessToken, registerUser, updateAccountDetails, updateAvatar, updateCoverImage } from './../controllers/user.controller.js'
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();


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


router.route("/refresh-token").post(refreshAccessToken);

// secured routes (which required auth middleware)
router.use(verifyJWT);

router.route("/logout").post(logoutUer);
router.route("/Change-Password").post(changeCurrentPassword)

router.route("/update-Account").post(updateAccountDetails);
router.route("/update-Avatar").post(upload.single('avatar'), updateAvatar)
router.route("/update-CoverImage").post(upload.single('coverImage'), updateCoverImage)












export default router