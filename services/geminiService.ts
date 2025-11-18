import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

/**
 * Gets a chat response from the Gemini API using a stateless approach.
 * @param history The entire conversation history.
 * @param apiKey The user's Gemini API key.
 * @param persona The system instruction that defines the bot's persona.
 * @returns The bot's response text.
 */
export const getChatResponse = async (
  history: ChatMessage[],
  apiKey: string,
  persona: string,
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
        systemInstruction: persona,
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