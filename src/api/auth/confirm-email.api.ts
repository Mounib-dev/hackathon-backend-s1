import type { Request, Response } from "express";
import type { Secret } from "jsonwebtoken";

import jwt from "jsonwebtoken";
import { User } from "../../entity/User";
import { AppDataSource } from "../../data-source";

const JWT_SECRET = <Secret>process.env.JWT_SECRET;

export const confirmEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token as string, JWT_SECRET) as {
      email: string;
    };

    const userRepisitory = AppDataSource.getRepository(User);
    console.log(decoded);
    try {
      const user = await userRepisitory.findOneBy({
        email: decoded.email,
      });
      console.log("User", user);
      if (user) {
        user.confirmedEmail = true;
        await userRepisitory.save(user);
      }
    } catch (err) {
      console.error(err);
      res.status(404).json({
        message: "L'adresse email que vous essayez de valider n'existe pas",
      });
    }

    res.status(200).json({
      message: "Adresse mail validée, vous pouvez à présent vous connecter",
    });
  } catch (err) {
    res.status(400).json({ message: "Votre lien de confirmation a expiré." });
  }
};
