import { Router } from "express";
import {
  createAlert,
  deleteAlert,
  retrieveAlerts,
  updateAlert,
} from "../../api/alert/alert.api";
import authorizeUser from "../../middlewares/authorize";

const router = Router();

router.post("/create", authorizeUser, createAlert);

router.get("/list", authorizeUser, retrieveAlerts);

router.put("/:id", authorizeUser, updateAlert);

router.delete("/:id", authorizeUser, deleteAlert);

export default router;
