import { NextResponse } from "next/server";
import { CONSTANTS } from "@/app/config/CONSTANTS";
import { generateStream, handleToolCall } from "@/lib/ai";
import { FunctionCallingConfigMode } from "@google/genai";
import { getChatHistory, updateMessages } from "@/lib/chatService";
import { generateSummary } from "@/lib/summaryService";


import { FD_ScheduleMeet, toolRegistery } from "@/Functions/functions";

export async function POST(req) {
  try {
    const { msg, clientId } = await req.json();
    if (!msg || msg.length > 200)
      return NextResponse.json({ error: "Invalid message length" }, { status: 400 });
    if (!clientId)
      return NextResponse.json({ error: "Invalid user" }, { status: 400 });

    const { chatHistory, chatId, summary, history } = await getChatHistory(clientId);

    const contents = summary
      ? [{ role: "user", parts: [{ text: summary }] }, ...chatHistory, { role: "user", parts: [{ text: msg }] }]
      : [...chatHistory, { role: "user", parts: [{ text: msg }] }];

    const stream = await generateStream({
      model: CONSTANTS.MODELS.FAST,
      contents,
      config: { 
        tools: [{functionDeclaration: FD_ScheduleMeet}],
        toolsConfig: {
          mode: FunctionCallingConfigMode.ANY,
          allowedFunctionNames: Object.keys(toolRegistery),
        },
       }
    });

    return new Response(
      new ReadableStream({
        async start(controller) {
          let buffer = "";
          try {
            for await (const chunk of stream) {
              console.log("CHUNK>>>>>>>",JSON.stringify(chunk));
              
              buffer += chunk.text || "";
              controller.enqueue(chunk.text);
              const fc = chunk.functionCalls;

              if(fc && fc.length > 0){
                await handleToolCall({...fc[0], contents, controller});
              }
            }
            await updateMessages(chatId, msg, buffer);
            // if (!summary) await generateSummary(history, chatId);
          } catch (err) {
            console.error("STREAM_ERROR", err);
            controller.enqueue("Looks like there are lots of requests in the queue.-endl- Please try again later.-endl-");
          } finally {
            controller.close();
          }
        }
      }),
      { headers: { "Content-Type": "text/event-stream" } }
    );
  } catch (e) {
    console.error("CHAT_ROUTE_ERROR", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
