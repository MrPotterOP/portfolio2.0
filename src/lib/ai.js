import { GoogleGenAI } from "@google/genai";
import { CONSTANTS } from "@/app/config/CONSTANTS";
import { propmts } from "@/app/config/prompts";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateContent = async ({ model, contents, config = {} }) => {
  return ai.models.generateContent({
    model: model || CONSTANTS.MODELS.FAST,
    contents,
    config: { temperature: 0.6, systemInstruction: propmts.chatBot, ...config }
  });
};

export const generateStream = async ({ model, contents, config = {} }) => {  

  console.log("CONFIG>>>>>>>>>>>>>>>>",JSON.stringify(config));

  let configure = {temperature: 0.6, systemInstruction: propmts.chatBot, ...config};

  console.log("CONFIGURE>>>>>>>>>>>>>>>>",JSON.stringify(configure));
  
  
  return ai.models.generateContentStream({
    model: model || CONSTANTS.MODELS.FAST,
    contents,
    config: configure,
  });
};

export const handleToolCall = async ({ functionName, args, contents, controller }) => {
  console.log(functionName, args, "FNN");

  controller.enqueue(`Function called: ${functionName}`);
};
