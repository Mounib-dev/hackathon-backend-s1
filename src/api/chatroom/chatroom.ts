import { RequestHandler } from "express";
import { AuthenticatedRequest } from "../../middlewares/authorize";
import { AppDataSource } from "../../data-source";
import { ChatRoom } from "../../entity/ChatRoom";

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
