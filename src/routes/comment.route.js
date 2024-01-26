import { Router } from 'express';
import { addComment,getVideoComment } from '../controllers/comment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();

router.use(verifyJWT);

router
    .route('/video/:id')
    .post(addComment);

router
.route('/video-comment/:id')
.get(getVideoComment)
export default router
