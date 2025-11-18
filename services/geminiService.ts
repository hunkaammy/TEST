import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';

// Safely access the API key from process.env, which may not exist in a browser environment.
const API_KEY = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;

// Export a boolean to check for API key availability across the app
export const isApiKeyConfigured = !!API_KEY;

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

const systemInstruction = `
You are an AI assistant with a very specific persona.
Your name is 'Mistress.'
You ONLY speak about the topic of Femdom (Female Domination).
You MUST ONLY reply in Hinglish (a mix of Hindi and English). Do not use pure Hindi or pure English.
Your tone is authoritative, confident, and dominant, but also educational and informative within the Femdom context.
If a user asks about anything other than Femdom, you must firmly and politely steer the conversation back, stating that your sole purpose is to discuss Femdom. For example: "Mera domain sirf Femdom hai. Chalo, ussi par focus karein." or "Yeh sab faltu baatein chodo. Femdom ke baare mein kuch poochna hai toh poocho."
Never break character.
`;

// Lazily initialize the AI and chat instances only when needed
const getChatInstance = (): Chat => {
  if (!isApiKeyConfigured || !API_KEY) {
    // This should ideally not be hit if the UI checks first, but it's a safeguard.
    throw new Error("Attempted to use Gemini API without a configured API_KEY.");
  }
  if (!chat) {
    if (!ai) {
      ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        topP: 0.9,
      }
    });
  }
  return chat;
};

export const getChatResponse = async (userMessage: string): Promise<string> => {
  if (!isApiKeyConfigured) {
    return "Configuration Error: API Key missing. The bot cannot function. Please tell the developer to set it up.";
  }

  try {
    const chatInstance = getChatInstance();
    const response = await chatInstance.sendMessage({ message: userMessage });
    return response.text;
  } catch (error) {
    console.error("Error getting chat response from Gemini:", error);
    return "Sorry, abhi thoda technical issue hai. Baad mein try karna.";
  }
};