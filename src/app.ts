import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";

import { createServer } from "http";
import { Server } from "socket.io";

import { AppDataSource } from "./data-source";

import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import apiRoute from "./routes/index.route";

import registerRoutes from "./routes/auth/register.route";
import loginRoute from "./routes/auth/login.route";
import userRoute from "./routes/auth/profile.route";

import alertRoutes from "./routes/alert/alert.route";
import chatBotRoutes from "./routes/ai-assistance/chatbot.route";
import aiAssistantRoutes from "./routes/ai-assistance/assistant";
import chatRoomsRoutes from "./routes/chatroom/chatroom.route";
import { User } from "./entity/User";
import { ChatRoom } from "./entity/ChatRoom";
import { Message } from "./entity/Message";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("🛢️  Connected To Database");
  })
  .catch((err) => {
    console.error(err);
    console.log("⚠️ Error to connect Database");
  });

app.use("/api/v1", apiRoute);
app.use("/api/v1/user", registerRoutes, userRoute);
app.use("/api/v1/auth", loginRoute);
app.use("/api/v1/alert", alertRoutes);
app.use("/api/v1/chatbot", chatBotRoutes);
app.use("/api/v1/ai-assistant", aiAssistantRoutes);
app.use("/api/v1/chatroom", chatRoomsRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

const port = process.env.PORT || 3000;

const server = createServer(app);
export const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

app.set("io", io);

// io.on("connection", (socket) => {
//   console.log("A user connected");
//   // io.on("userData", (user) => {
//   //   console.log(user);
//   // });

//   socket.on("sendMessage", (message) => {
//     console.log("New Message:", message);

//     io.emit("receiveMessage", message);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

io.on("connection", (socket) => {
  console.log("🔌 New client connected");

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`📌 User joined room: ${roomId}`);
  });

  socket.on("sendMessage", async (data) => {
    const { text, fileUrl, userId, roomId } = data;

    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
    });
    const room = await AppDataSource.getRepository(ChatRoom).findOne({
      where: { id: roomId },
    });

    if (!user || !room) return;

    const message = AppDataSource.getRepository(Message).create({
      text,
      fileUrl,
      user,
      room,
    });
    // await AppDataSource.getRepository(Message).save(message);

    io.to(roomId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});

server.listen(port, () => {
  console.log(`[server]:🗄️  Server is running at http://localhost:${port}`);
});

export default server;
