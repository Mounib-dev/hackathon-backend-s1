import { Router } from "express";
import { chatBot, chatBotHistory } from "../../api/ai-assistance/chatbot";
import authorizeUser from "../../middlewares/authorize";

const router = Router();

router.get("/history", authorizeUser, chatBotHistory);

router.post("/assistant", authorizeUser, chatBot);

export default router;
