import { Router } from "express";
import authorizeUser from "../../middlewares/authorize";
import { retrieveUsers } from "../../api/auth/users.api";

const router = Router();

router.get("/list", authorizeUser, retrieveUsers);

export default router;
