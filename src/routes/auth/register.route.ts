import { Router } from "express";

import {
  createUser,
  updateUser,
  deleteUser,
} from "../../api/auth/register.api";

const router = Router();

router.post("/register", createUser);

router.put("/update/:id", updateUser);

router.delete("/delete/:id", deleteUser);

export default router;
