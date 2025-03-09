import { Router } from "express";
import { chatBot, chatBotHistory } from "../../api/chatbot/chatbot";
import authorizeUser from "../../middlewares/authorize";

const router = Router();

router.get("/history", authorizeUser, chatBotHistory);

router.post("/assistant", authorizeUser, chatBot);

export default router;
