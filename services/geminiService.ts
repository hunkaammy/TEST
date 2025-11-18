import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';

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

/**
 * Initializes the chat instance with the user's API key.
 * @param apiKey The user's Gemini API key.
 */
export const initializeChat = (apiKey: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        topP: 0.9,
      }
    });
    return true;
  } catch(error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    chat = null;
    return false;
  }
};

/**
 * Resets the chat instance, used when changing API keys.
 */
export const resetChat = () => {
    chat = null;
}


export const getChatResponse = async (userMessage: string): Promise<string> => {
  if (!chat) {
    throw new Error("Chat is not initialized. Please provide an API key.");
  }

  try {
    const response = await chat.sendMessage({ message: userMessage });
    return response.text;
  } catch (error: any) {
    console.error("Error getting chat response from Gemini:", error);

    // Check for specific API key-related errors
    if (error.message && (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID'))) {
      throw new Error('Invalid API Key');
    }

    return "Sorry, abhi thoda technical issue hai. Baad mein try karna.";
  }
};