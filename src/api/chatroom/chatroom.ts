import { RequestHandler } from "express";
import { AuthenticatedRequest } from "../../middlewares/authorize";
import { AppDataSource } from "../../data-source";
import { ChatRoom } from "../../entity/ChatRoom";
import { Message } from "../../entity/Message";
import { User } from "../../entity/User";

export const createChatRoom: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
): Promise<any> => {
  const { name, icon } = req.body;
  try {
    const ChatRoomRepository = AppDataSource.getRepository(ChatRoom);
    const chatRoom = ChatRoomRepository.create({
      name,
      icon,
    });
    await ChatRoomRepository.save(chatRoom);
    return res.status(201).json({
      message: `Salon ${chatRoom.name} créé avec succès`,
    });
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({
        message: "Ce nom de salon est déjà pris",
      });
    }
    console.error(err);
    return res.status(500).json({
      message: "La création de votre salon a échoué, veuillez réessayer.",
    });
  }
};

export const retrieveChatRooms: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
): Promise<any> => {
  try {
    const ChatRoomRepository = AppDataSource.getRepository(ChatRoom);
    const chatRooms = await ChatRoomRepository.find();
    if (!chatRooms) {
      return res.status(404).json({
        message: "Aucun salon trouvé.",
      });
    }
    return res.status(200).json(chatRooms);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: "La création de votre salon a échoué, veuillez réessayer.",
    });
  }
};

export const getChatRoomMessages: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
): Promise<any> => {
  const { roomId } = req.params;
  const messages = await AppDataSource.getRepository(Message).find({
    where: { room: { id: Number(roomId) } },
    relations: ["user"],
    order: { createdAt: "ASC" },
  });

  res.status(200).json(messages);
};

export const sendMessage: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
): Promise<any> => {
  console.log(req.body);
  const { text, fileUrl, userId, roomId } = req.body;

  const user = await AppDataSource.getRepository(User).findOne({
    where: { id: Number(userId) },
  });
  const room = await AppDataSource.getRepository(ChatRoom).findOne({
    where: { id: Number(roomId) },
  });

  if (!user || !room)
    return res.status(400).json({ error: "Invalid user or room" });

  const newMessage = AppDataSource.getRepository(Message).create({
    text,
    fileUrl,
    user,
    room,
  });

  await AppDataSource.getRepository(Message).save(newMessage);

  // Emit the message via WebSocket
  req.app.get("io").to(roomId).emit("receiveMessage", newMessage);

  res.status(201).json(newMessage);
};
