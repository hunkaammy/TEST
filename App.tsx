import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage as ChatMessageType } from './types';
import { getChatResponse, initializeChat, resetChat } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ApiKeySetup } from './components/ApiKeySetup';


const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      role: 'bot',
      text: "Hmph. Tum aa gaye. Main 'Mistress' hoon. Sirf Femdom par baat hogi. Time waste mat karna. Poocho, kya jaanna hai?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) {
      if (initializeChat(savedKey)) {
        setApiKey(savedKey);
        setApiKeyError(null);
      } else {
        localStorage.removeItem('GEMINI_API_KEY');
        setApiKeyError("The stored API Key is invalid. Please enter a valid one.");
      }
    }
  }, []);


  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInvalidApiKey = useCallback(() => {
    localStorage.removeItem('GEMINI_API_KEY');
    setApiKey(null);
    resetChat();
    setApiKeyError("Your API Key is invalid or has been rejected. Please enter a valid one.");
  }, []);

  const handleSendMessage = useCallback(async (userMessage: string) => {
    if (!apiKey) {
      handleInvalidApiKey();
      return;
    }

    setIsLoading(true);
    const newUserMessage: ChatMessageType = { role: 'user', text: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const botResponseText = await getChatResponse(userMessage);
      const newBotMessage: ChatMessageType = { role: 'bot', text: botResponseText };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (err) {
      if (err instanceof Error && err.message === 'Invalid API Key') {
        handleInvalidApiKey();
      } else {
        const errorBotMessage: ChatMessageType = {
          role: 'bot',
          text: 'Sorry, abhi thoda technical issue hai. Baad mein try karna.',
        };
        setMessages((prev) => [...prev, errorBotMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, handleInvalidApiKey]);
  
  const handleKeySubmit = (newKey: string) => {
    const trimmedKey = newKey.trim();
    if(trimmedKey && initializeChat(trimmedKey)) {
      localStorage.setItem('GEMINI_API_KEY', trimmedKey);
      setApiKey(trimmedKey);
      setApiKeyError(null);
    } else {
      setApiKeyError("Invalid API key format. Please check and try again.");
    }
  }

  const handleChangeApiKey = () => {
    localStorage.removeItem('GEMINI_API_KEY');
    setApiKey(null);
    resetChat();
    setApiKeyError(null);
  }


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
        <button onClick={handleChangeApiKey} className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-md transition-colors">
          Change Key
        </button>
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
    </div>
  );
};

export default App;