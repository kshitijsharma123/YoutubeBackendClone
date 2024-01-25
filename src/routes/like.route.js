import { Router } from 'express';
const router = Router();

import { toggleVideoLike,toggleCommentLike } from "./../controllers/like.controller.js"
import { verifyJWT } from '../middlewares/auth.middleware.js';


// secure Route
router.use(verifyJWT)
router.route("/video/:id").post(toggleVideoLike);
router.route("/comment/:id").post(toggleCommentLike);




export default router
