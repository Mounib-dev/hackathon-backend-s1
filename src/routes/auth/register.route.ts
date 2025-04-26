import { Router } from "express";

import {
  createUser,
  updateUser,
  deleteUser,
} from "../../api/auth/register.api";
import { confirmEmail } from "../../api/auth/confirm-email.api";

const router = Router();

router.post("/register", createUser);

router.get("/confirm-registration", confirmEmail);

router.put("/update/:id", updateUser);

router.delete("/delete/:id", deleteUser);

export default router;
