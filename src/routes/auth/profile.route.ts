import { Router } from "express";
import authorizeUser from "../../middlewares/authorize";
import { userInfo } from "../../api/auth/profile.api";

const router = Router();

router.get("/info", authorizeUser, userInfo);

export default router;
