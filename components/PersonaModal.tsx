import React, { useState, useEffect } from 'react';

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPersona: string) => void;
  onReset: () => void;
  currentPersona: string;
}

export const PersonaModal: React.FC<PersonaModalProps> = ({ isOpen, onClose, onSave, onReset, currentPersona }) => {
  const [personaText, setPersonaText] = useState(currentPersona);

  useEffect(() => {
    setPersonaText(currentPersona);
  }, [currentPersona, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (personaText.trim()) {
      onSave(personaText);
    }
  };
  
  const handleReset = () => {
      onReset();
      // Instantly close after reset to see the effect or let user save the reset version
      onClose(); 
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl border border-purple-500/30 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-purple-400">Edit Chatbot Persona</h2>
          <p className="text-sm text-gray-400">Define the behavior and personality of your chatbot here.</p>
        </header>
        
        <main className="p-6 flex-grow">
          <textarea
            value={personaText}
            onChange={(e) => setPersonaText(e.target.value)}
            className="w-full h-80 bg-gray-900 text-gray-200 rounded-md p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 resize-none"
            placeholder="Enter the system instruction for the chatbot..."
          />
        </main>
        
        <footer className="p-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center gap-4 flex-wrap">
          <button
            onClick={handleReset}
            className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-md transition-colors"
          >
            Reset to Default
          </button>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="text-sm bg-gray-600 hover:bg-gray-500 text-gray-200 px-6 py-2 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-md transition-transform duration-200 active:scale-95"
            >
              Save & Reset Chat
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};