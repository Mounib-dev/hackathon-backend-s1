import { RequestHandler } from "express";
import { Alert } from "../../entity/Alert";
import { AppDataSource } from "../../data-source";
import { AuthenticatedRequest } from "../../middlewares/authorize";
import { User } from "../../entity/User";
import { io } from "../../app";

export const createAlert: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
): Promise<any> => {
  const { title, description, priorityLevel, location } = req.body;
  const userId = req.user?.id;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: {
      id: userId,
    },
  });
  const alertRepository = AppDataSource.getRepository(Alert);
  // Add Town
  if (user) {
    const newAlert = alertRepository.create({
      title,
      description,
      priorityLevel,
      location,
      user: user,
    });
    try {
      await alertRepository.save(newAlert);
      io.emit("new-alert", {
        content: `${title} à ${location}`,
      });
      return res.status(201).json({
        message: `Alerte créée : ${newAlert}}`,
      });
    } catch (err: any) {
      if (err.code === "23505") {
        res.status(409).json({
          message: "Une demande avec la même adresse existe déjà",
        });
      }
      console.error(err);
      return res.status(500).json({
        message: "La création de votre demande a échoué, veuillez réessayer.",
      });
    }
  }
  return res.status(500).json({
    message: "La création de votre demande a échoué, veuillez réessayer.",
  });
};

export const retrieveAlerts: RequestHandler = async (
  req,
  res,
  next
): Promise<any> => {
  const alertRepository = AppDataSource.getRepository(Alert);
  try {
    const alerts = await alertRepository.find();
    return res.status(200).json({ alerts });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des alertes",
    });
  }
};
