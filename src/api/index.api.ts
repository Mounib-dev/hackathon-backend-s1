import { RequestHandler } from "express";

export const apiPortal: RequestHandler = (req, res, next) => {
  res.status(200).json({
    message: "API V1",
  });
};
