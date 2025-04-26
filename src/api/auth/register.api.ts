import type { Request, Response } from "express";
import type { Secret } from "jsonwebtoken";

import { User, UserRole } from "../../entity/User";
import { AppDataSource } from "../../data-source";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { sendConfirmationEmail } from "../../utils/mailer";

const saltRound = 10;
const JWT_SECRET = <Secret>process.env.JWT_SECRET;

export const createUser = async (req: Request, res: Response): Promise<any> => {
  const { firstName, lastName, birthDate, phoneNumber, email, password } =
    req.body;
  const hashedPassword = await bcrypt.hash(password, saltRound);
  const user = new User(
    firstName,
    lastName,
    birthDate,
    phoneNumber,
    email,
    hashedPassword,
    UserRole.USER,
    false
  );
  const userRepository = AppDataSource.getRepository(User);
  try {
    await userRepository.save(user);
    const confirmationToken = jwt.sign({ email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    await sendConfirmationEmail(email, confirmationToken);

    return res.status(201).json({
      message:
        "Inscription réussie, vous allez recevoir un email de validation sur l'adresse indiquée",
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
