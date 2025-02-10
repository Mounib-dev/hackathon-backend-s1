import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";

import { AppDataSource } from "./data-source";

import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import apiRoute from "./routes/index.route";

import registerRoutes from "./routes/auth/register.route";
import loginRoute from "./routes/auth/login.route";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("🛢️  Connected To Database");
  })
  .catch(() => {
    console.log("⚠️ Error to connect Database");
  });

app.use("/api/v1", apiRoute);
app.use("/api/v1/user", registerRoutes);
app.use("/api/v1/auth", loginRoute);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`[server]:🗄️  Server is running at http://localhost:${port}`);
});

export default app;
