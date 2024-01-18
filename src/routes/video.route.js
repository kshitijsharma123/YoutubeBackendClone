import { Router } from 'express';
import { searchVideos } from '../controllers/video.controller.js';
const router = Router();


//  title?=value
// *** do this using query
router.route("/:title").get(searchVideos)

export default router