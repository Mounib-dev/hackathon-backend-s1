import { Router } from "express";
import { createChatRoom, retrieveChatRooms } from "../../api/chatroom/chatroom";
import authorizeUser from "../../middlewares/authorize";

const router = Router();

router.post("/create", authorizeUser, createChatRoom);

router.get("/list", authorizeUser, retrieveChatRooms);

export default router;
