import { Router } from "express";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { toggleVideoDislike } from "../controllers/dislike.controller.js";
router.use(verifyJWT);

router.route("/video/:id").post(toggleVideoDislike);

export default router;
