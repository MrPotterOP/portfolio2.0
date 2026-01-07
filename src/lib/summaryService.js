import { generateContent } from "./ai";
import { updateSummary } from "./chatService";
import { CONSTANTS } from "@/app/config/CONSTANTS";

export const generateSummary = async (messages, chatId) => {
  const content = messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const prompt = `
I'll be providing you a conversation history and your job is to summarize it in a concise manner (220-300 words). 
This is a conversation between a user (a website visitor) and an AI assistant (website agent).
Focus on important details that would help the assistant remember context for the future.

Start the summary with this sentence:
"Summary of previous conversation: ..."

Conversation:
${content}
`;

  const response = await generateContent({
    model: CONSTANTS.MODELS.DETAILED,
    contents: content,
    config: { temperature: 0.6,  systemInstruction: prompt }
  });

  const summary =
    response.text ||
    response.candidates?.[0]?.content?.parts?.[0]?.text ||
    null;

  if (summary) await updateSummary(chatId, summary);
};
