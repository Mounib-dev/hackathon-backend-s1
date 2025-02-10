import dotenv from "dotenv";
dotenv.config();

import express, { RequestHandler } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import api from "./api/index";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<RequestHandler>("/", (req, res) => {
  res.json({
    message: "Welcome to Node.js Express.js with TypeScript",
  });
});

app.use("/api/v1", api);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`[server]:🗄️  Server is running at http://localhost:${port}`);
});

export default app;
