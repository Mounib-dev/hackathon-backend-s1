import { Router } from "express";
import { aiAssistant } from "../../api/ai-assistance/assistant";
import authorizeUser from "../../middlewares/authorize";

const router = Router();

router.post("/advice", authorizeUser, aiAssistant);

export default router;
