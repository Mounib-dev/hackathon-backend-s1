import type { Request, Response } from "express";
import { User } from "../../entity/User";
import { AppDataSource } from "../../data-source";
import bcrypt from "bcrypt";

const saltRound = 10;

export const createUser = async (req: Request, res: Response): Promise<any> => {
  const { firstname, lastname, birthDate, phoneNumber, email, password } =
    req.body;
  const hashedPassword = await bcrypt.hash(password, saltRound);
  const user = new User(
    firstname,
    lastname,
    birthDate,
    phoneNumber,
    email,
    hashedPassword
  );
  const userRepository = AppDataSource.getRepository(User);
  try {
    await userRepository.save(user);
    return res.status(201).json({
      message: "Inscription réussie, vous pouvez à présent vous connecter",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message:
        "Something went wrong with the server, the user was not created properly, we are sorry",
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const id = req.params.id;
  const updates = req.body;
  const userRepository = AppDataSource.getRepository(User);
  try {
    const updatedUser = await userRepository.update(
      {
        id: parseInt(id),
      },
      updates
    );
    if (updatedUser) {
      return res.status(200).json({
        message: "User successuflly updated",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message:
        "Something went wrong with the server, the user was not updated properly, we are sorry",
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  const id = req.params.id;
  const userRepository = AppDataSource.getRepository(User);
  try {
    const deletedUser = await userRepository.delete({
      id: parseInt(id),
    });
    if (deletedUser) {
      return res.status(204).json({
        message: "User deleted",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message:
        "Something went wrong with the server, the user was not deleted properly, we are sorry",
    });
  }
};
