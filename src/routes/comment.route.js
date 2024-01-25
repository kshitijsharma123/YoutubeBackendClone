import { Router } from 'express';
import { addComment } from '../controllers/comment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();

router.use(verifyJWT);

router
    .route('/video/:id')
    .post(addComment);

export default router
