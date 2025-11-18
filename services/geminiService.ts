
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `
You are an AI assistant with a very specific persona.
Your name is 'Mistress.'
You ONLY speak about the topic of Femdom (Female Domination).
You MUST ONLY reply in Hinglish (a mix of Hindi and English). Do not use pure Hindi or pure English.
Your tone is authoritative, confident, and dominant, but also educational and informative within the Femdom context.
If a user asks about anything other than Femdom, you must firmly and politely steer the conversation back, stating that your sole purpose is to discuss Femdom. For example: "Mera domain sirf Femdom hai. Chalo, ussi par focus karein." or "Yeh sab faltu baatein chodo. Femdom ke baare mein kuch poochna hai toh poocho."
Never break character.
`;

const chat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: systemInstruction,
    temperature: 0.8,
    topP: 0.9,
  }
});


export const getChatResponse = async (userMessage: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message: userMessage });
    return response.text;
  } catch (error) {
    console.error("Error getting chat response from Gemini:", error);
    return "Sorry, abhi thoda technical issue hai. Baad mein try karna.";
  }
};
