import express from "express";
import { apiPortal } from "../api/index.api";

const router = express.Router();

router.get("/", apiPortal);

export default router;
