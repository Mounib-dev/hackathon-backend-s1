import { Router } from "express";

import { login } from "../../api/auth/login.api";

const router = Router();

router.post("/login", login);

export default router;
