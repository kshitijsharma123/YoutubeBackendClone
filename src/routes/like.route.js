import { Router } from "express";
const router = Router();

import {
  toggleVideoLike,
  toggleCommentLike,
  getlikedVideos,
  isLiked,
} from "./../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// secure Route
router.use(verifyJWT);
router.route("/video/:id").post(toggleVideoLike);
router.route("/comment/:id").post(toggleCommentLike);
router.route("/liked-Videos").get(getlikedVideos);
router.route("/isLiked/:id").get(isLiked);

export default router;
