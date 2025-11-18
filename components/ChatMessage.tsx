
import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const BotIcon = () => (
    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
        M
    </div>
);

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);


export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === 'bot';

  const messageContainerClasses = `flex items-start gap-3 my-4 ${isBot ? '' : 'flex-row-reverse'}`;
  const messageBubbleClasses = `rounded-2xl px-4 py-3 max-w-md lg:max-w-xl shadow-md break-words ${
    isBot 
      ? 'bg-gray-700 text-gray-200 rounded-bl-none' 
      : 'bg-purple-600 text-white rounded-br-none'
  }`;

  return (
    <div className={messageContainerClasses}>
      {isBot ? <BotIcon /> : <UserIcon />}
      <div className={messageBubbleClasses}>
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};
