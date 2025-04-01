import { Router } from "express";
import {
  createChatRoom,
  getChatRoomMessages,
  retrieveChatRooms,
  sendMessage,
} from "../../api/chatroom/chatroom";
import authorizeUser from "../../middlewares/authorize";

const router = Router();

router.post("/create", authorizeUser, createChatRoom);

router.get("/list", authorizeUser, retrieveChatRooms);

router.get("/messages/:roomId", authorizeUser, getChatRoomMessages);

router.post("/messages", authorizeUser, sendMessage);

export default router;
