import React, { useState } from 'react';

interface ApiKeySetupProps {
  onKeySubmit: (key: string) => void;
  error: string | null;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onKeySubmit, error }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-2xl border border-purple-500/30">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 016-6h4a6 6 0 016 6z" />
            </svg>
            <h1 className="text-2xl font-bold text-purple-400 mb-2">Provide Your API Key</h1>
            <p className="text-gray-300 mb-6">
                To begin your session with the Mistress, please enter your Google Gemini API key.
            </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="apiKey" className="sr-only">Gemini API Key</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API Key here..."
              className="w-full bg-gray-700 text-gray-200 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={!apiKey.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-md h-12 flex items-center justify-center font-semibold transition-transform duration-200 active:scale-95"
          >
            Save & Start Chat
          </button>
        </form>
         <div className="text-center mt-6">
            <a 
                href="https://ai.google.dev/gemini-api/docs/api-key" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-purple-400 underline transition-colors"
            >
                Don't have a key? Get one from Google AI Studio
            </a>
        </div>
      </div>
    </div>
  );
};
