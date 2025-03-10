import { RequestHandler } from "express";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { AuthenticatedRequest } from "../../middlewares/authorize";

const model = openai("gpt-4o");

export const aiAssistant: RequestHandler = async (
  req: AuthenticatedRequest,
  res
): Promise<any> => {
  console.log(req.body);
  const { title, category, description, priority } = req.body;
  console.log(req.user?.id);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const result = await generateText({
      model,
      messages: [
        {
          role: "system",
          content: `
            Tu es un expert en assistance et conseil. À partir des informations suivantes :

            Titre : ${title}
            Catégorie : ${category}
            Description : ${description}
            Niveau de criticité : ${priority}
            Donne des conseils pertinents et actionnables sous forme de bullet points. Tes conseils doivent être concis, clairs et adaptés au niveau de criticité indiqué. 
            S'il s'agit d'une situation critique, propose des actions immédiates et prioritaires.
            `,
        },
      ],
    });
    console.log(result.text);
    return res.status(200).json({ response: result.text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Sorry the generation of advice failed.",
    });
  }
};
