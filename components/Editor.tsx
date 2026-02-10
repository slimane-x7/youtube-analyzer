
import React, { useState } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';

interface EditorProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const Editor: React.FC<EditorProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <Sparkles size={20} />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">AI Architect</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            What kind of document would you like to build?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a 2-page project proposal for a new mobile app with a timeline table and budget list..."
            className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-slate-700"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all ${
            isLoading || !prompt.trim()
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Generating Structure...
            </>
          ) : (
            <>
              <Send size={18} />
              Generate Document
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Editor;
