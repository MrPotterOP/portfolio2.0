import prisma from "@/lib/prisma";

export const getChatHistory = async (userId) => {
  const chat = await prisma.Chat.findUnique({
    where: { userId },
    include: { messages: { orderBy: [{ createdAt: "asc" }, { id: "asc" }] } }
  });

  if (!chat) throw new Error("Chat not found");

  let history = null;
  if (chat.messages.length > 8) {
    if (!chat.lastSummary) {
      history = chat.messages;
    }
    chat.messages = chat.messages.slice(-8);
  }

  const chatHistory = chat.messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }]
  }));

  return { chatHistory, chatId: chat.id, summary: chat.lastSummary, history };
};

export const updateMessages = async (chatId, userMsg, assistantMsg) => {
  await prisma.$transaction([
    prisma.Message.create({ data: { role: "user", content: userMsg, chatId } }),
    prisma.Message.create({
      data: { role: "assistant", content: assistantMsg, chatId }
    })
  ]);
};

export const updateSummary = async (chatId, summary) => {
  await prisma.Chat.update({
    where: { id: chatId },
    data: { lastSummary: summary }
  });
};
