import { RequestHandler } from "express";
import { AuthenticatedRequest } from "../../middlewares/authorize";
import { User } from "../../entity/User";
import { AppDataSource } from "../../data-source";

export const retrieveUsers: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
): Promise<User[] | any> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      select: { id: true, firstName: true, lastName: true },
    });
    if (users.length > 0) {
      return res.status(200).json(users);
    }
    return res.status(404).json({ message: "Aucun utilisateur trouvé." });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message:
        "Something went wrong with the server, the users were not retrieved properly",
    });
  }
};
