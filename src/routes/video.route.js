import { Router } from 'express';
import { deleteVideo, searchVideos } from '../controllers/video.controller.js';
const router = Router();

import { verifyJWT } from '../middlewares/auth.middleware.js';

//  title?=value
// *** do this using query
router.route("/:title")
    .get(searchVideos);


// secure Routes

router.use(verifyJWT)

router.route('/delete/:id').delete(deleteVideo)

export default router