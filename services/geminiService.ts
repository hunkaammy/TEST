import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

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
 * Gets a chat response from the Gemini API using a stateless approach.
 * @param history The entire conversation history.
 * @param apiKey The user's Gemini API key.
 * @returns The bot's response text.
 */
export const getChatResponse = async (
  history: ChatMessage[],
  apiKey: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey });

    const contents = history.map(msg => ({
      role: msg.role === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    return response.text;
  } catch (error: any) {
    console.error("Error getting chat response from Gemini:", error);
    const errorMessage = error.message || '';

    if (errorMessage.includes('API key not valid') || errorMessage.includes('API_KEY_INVALID')) {
      throw new Error('Invalid API Key');
    }
    if (errorMessage.includes('503') || errorMessage.toUpperCase().includes('UNAVAILABLE') || errorMessage.includes('overloaded')) {
      throw new Error('Model Overloaded');
    }
    throw new Error("Sorry, abhi thoda technical issue hai. Baad mein try karna.");
  }
};