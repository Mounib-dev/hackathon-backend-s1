import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { AuthPayload } from "../api/auth/login.api";

const JWT_SECRET = <Secret>process.env.JWT_SECRET;

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

const authorizeUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  try {
    const decoded = <AuthPayload>jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({
      message: "Vous n'êtes pas autorisé à effectuer cette action.",
    });
    return;
  }
};

export default authorizeUser;
