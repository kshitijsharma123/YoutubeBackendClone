import { Router } from 'express';
import { UpdateVideos, deleteVideo, isPublishedStatus, searchVideos, updatethumbnail } from '../controllers/video.controller.js';
const router = Router();
import { upload } from "../middlewares/multer.middleware.js"

import { verifyJWT } from '../middlewares/auth.middleware.js';

//  title?=value

router.route("/")
    .get(searchVideos);


// secure Routes

router.use(verifyJWT)

router.
    route('/delete/:id')
    .delete(deleteVideo)


router
    .route("/Published-Status/:id")
    .post(isPublishedStatus)

router
    .route("/update/:id")
    .post(UpdateVideos);

router
    .route("/update-thumbnail/:id")
    .post(upload.single("thumbnail"), updatethumbnail);

export default router