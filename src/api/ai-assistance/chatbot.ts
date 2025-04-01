import { RequestHandler } from "express";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { AuthenticatedRequest } from "../../middlewares/authorize";

import { ChatbotConversation } from "../../entity/ChatbotConversation";
import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";

const model = openai("gpt-4o");

export const chatBot: RequestHandler = async (
  req: AuthenticatedRequest,
  res
) => {
  console.log(req.body);
  const { messages } = req.body;
  console.log(req.user?.id);
  const userId = req.user?.id;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const result = await streamText({
      model,
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant.
            People are having trouble.
            They need help, they need to stay calm.
            Answer politely even if they are rude.
            Give them advices according to their situation and what they say to you.
            `,
        },
        ...messages,
      ],
    });

    let fullResponse = "";

    for await (const chunk of result.textStream) {
      console.log(chunk);
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      fullResponse += chunk;
    }

    const ChatbotConversationRepository =
      AppDataSource.getRepository(ChatbotConversation);
    if (userId) {
      const UserRepository = AppDataSource.getRepository(User);
      const currentUser = await UserRepository.find({
        where: {
          id: userId,
        },
      });
      if (currentUser) {
        const previousHistory = await ChatbotConversationRepository.find({
          where: { user: currentUser },
        });
        if (previousHistory.length > 0) {
          ChatbotConversationRepository.delete({
            id: previousHistory[0].id,
          });
        }
      }
      const chatbotConversation = ChatbotConversationRepository.create({
        user: { id: userId },
        messages: [...messages, { role: "assistant", content: fullResponse }],
      });
      await ChatbotConversationRepository.save(chatbotConversation);
    }
  } catch (error) {
    console.error("Streaming error:", error);
    res.write(
      `data: ${JSON.stringify({ error: "Error processing request" })}\n\n`
    );
  } finally {
    res.end();
  }
};

export const chatBotHistory: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
): Promise<any> => {
  const userId = req.user?.id;
  const ChatbotConversationRepository =
    AppDataSource.getRepository(ChatbotConversation);
  try {
    const chatbotConversations = await ChatbotConversationRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        createdAt: "DESC",
      },
    });
    res.status(200).json(chatbotConversations);
  } catch (err) {
    res.status(500).json({
      message:
        "La récupération de l'historique des conversations n'a pas pu être récupéré.",
    });
  }
};
