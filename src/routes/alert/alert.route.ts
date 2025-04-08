import { Router } from "express";
import {
  createAlert,
  retrieveAlerts,
  updateAlert,
} from "../../api/alert/alert.api";
import authorizeUser from "../../middlewares/authorize";

const router = Router();

router.post("/create", authorizeUser, createAlert);

router.get("/list", authorizeUser, retrieveAlerts);

router.put("/:id", authorizeUser, updateAlert);
export default router;
