import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage as ChatMessageType } from './types';
import { getChatResponse } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ApiKeySetup } from './components/ApiKeySetup';
import { PersonaModal } from './components/PersonaModal';

const initialMessage: ChatMessageType = {
  role: 'bot',
  text: "Hmph. Tum aa gaye. Main 'Mistress' hoon. Sirf Femdom par baat hogi. Time waste mat karna. Poocho, kya jaanna hai?",
};

const defaultPersona = `
You are an AI assistant with a very specific persona.
Your name is 'Mistress.'
You ONLY speak about the topic of Femdom (Female Domination).
You MUST ONLY reply in Hinglish (a mix of Hindi and English). Do not use pure Hindi or pure English.
Your tone is authoritative, confident, and dominant, but also educational and informative within the Femdom context.
If a user asks about anything other than Femdom, you must firmly and politely steer the conversation back, stating that your sole purpose is to discuss Femdom. For example: "Mera domain sirf Femdom hai. Chalo, ussi par focus karein." or "Yeh sab faltu baatein chodo. Femdom ke baare mein kuch poochna hai toh poocho."
Never break character.
`;

const CHAT_HISTORY_KEY = 'femdom_chat_history';
const PERSONA_KEY = 'femdom_chatbot_persona';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessageType[]>(() => {
    try {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          return parsedHistory;
        }
      }
    } catch (error) {
      console.error("Could not load/parse chat history from localStorage", error);
    }
    return [initialMessage];
  });

  const [persona, setPersona] = useState<string>(() => {
    return localStorage.getItem(PERSONA_KEY) || defaultPersona;
  });

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(PERSONA_KEY, persona);
  }, [persona]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInvalidApiKey = useCallback(() => {
    localStorage.removeItem('GEMINI_API_KEY');
    setApiKey(null);
    setApiKeyError("Your API Key is invalid or has been rejected. Please enter a valid one.");
  }, []);

  const handleResetChat = useCallback(() => {
    setMessages([initialMessage]);
  }, []);

  const handleSendMessage = useCallback(async (userMessage: string) => {
    if (!apiKey) {
      handleInvalidApiKey();
      return;
    }

    setIsLoading(true);
    const newUserMessage: ChatMessageType = { role: 'user', text: userMessage };
    
    const historyForApi = [...messages, newUserMessage];
    setMessages(historyForApi);

    try {
      const botResponseText = await getChatResponse(historyForApi, apiKey, persona);
      const newBotMessage: ChatMessageType = { role: 'bot', text: botResponseText };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (err) {
      let errorBotMessage: ChatMessageType;
      if (err instanceof Error && err.message === 'Invalid API Key') {
        handleInvalidApiKey();
        return;
      } else if (err instanceof Error && err.message === 'Model Overloaded') {
        errorBotMessage = {
          role: 'bot',
          text: 'Mistress abhi busy hai. The model is currently overloaded. Thoda ruko, phir se try karna.',
        };
      } else {
        errorBotMessage = {
          role: 'bot',
          text: (err as Error).message || 'Sorry, abhi thoda technical issue hai. Baad mein try karna.',
        };
      }
      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, handleInvalidApiKey, messages, persona]);
  
  const handleKeySubmit = (newKey: string) => {
    const trimmedKey = newKey.trim();
    if(trimmedKey) {
      localStorage.setItem('GEMINI_API_KEY', trimmedKey);
      setApiKey(trimmedKey);
      setApiKeyError(null);
    } else {
      setApiKeyError("API key cannot be empty.");
    }
  }

  const handleChangeApiKey = () => {
    localStorage.removeItem('GEMINI_API_KEY');
    setApiKey(null);
    setApiKeyError(null);
  }

  const handleSavePersona = (newPersona: string) => {
    setPersona(newPersona);
    setIsPersonaModalOpen(false);
    handleResetChat(); // Reset chat for new persona context
  };

  if (!apiKey) {
    return <ApiKeySetup onKeySubmit={handleKeySubmit} error={apiKeyError} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800 p-4 border-b border-gray-700 shadow-lg flex justify-between items-center">
        <div className="text-center flex-grow">
          <h1 className="text-xl font-bold text-purple-400">Femdom Hinglish Chatbot</h1>
          <p className="text-xs text-gray-400">Aapki 'Mistress' ke saath</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsPersonaModalOpen(true)} className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-md transition-colors">
            Edit Persona
          </button>
          <button onClick={handleResetChat} className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-md transition-colors">
            Reset Chat
          </button>
          <button onClick={handleChangeApiKey} className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-md transition-colors">
            Change Key
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 my-4">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                M
              </div>
              <div className="rounded-2xl px-4 py-3 max-w-md lg:max-w-xl shadow-md bg-gray-700 rounded-bl-none">
                 <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
                 </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      
      <PersonaModal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
        onSave={handleSavePersona}
        currentPersona={persona}
        onReset={() => setPersona(defaultPersona)}
      />
    </div>
  );
};

export default App;