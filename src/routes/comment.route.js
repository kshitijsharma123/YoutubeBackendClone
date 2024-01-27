import { Router } from 'express';
import { addComment, getVideoComment, updateComment } from '../controllers/comment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();

router.use(verifyJWT);

router
    .route('/video/:id')
    .post(addComment);

router
    .route('/video-comment/:id')
    .get(getVideoComment)

router
    .route("/update-comment/:id")
    .post(updateComment)
export default router
