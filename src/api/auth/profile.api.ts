import { RequestHandler } from "express";
import { User } from "../../entity/User";
import { AppDataSource } from "../../data-source";
import { AuthenticatedRequest } from "../../middlewares/authorize";

type UserInfo = Pick<User, "firstName" | "lastName">;
export const userInfo: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
): Promise<UserInfo | any> => {
  const userRepository = AppDataSource.getRepository(User);
  try {
    const user: UserInfo | null = await userRepository.findOne({
      where: {
        id: req.user?.id,
      },
      select: ["firstName", "lastName"],
    });
    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }
    return res.status(200).json({
      user,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message:
        "Something went wrong with the server, the user was not created properly, we are sorry",
    });
  }
};
