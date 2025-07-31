
import React, { useState } from 'react';
import { RESEARCH_TYPES, URGENCY_LEVELS } from '../constants';
import type { ResearchRequestPayload } from '../types';

interface ResearchFormProps {
  onSubmit: (formData: Omit<ResearchRequestPayload, 'email'>) => Promise<boolean>;
}

const ResearchForm: React.FC<ResearchFormProps> = ({ onSubmit }) => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState(RESEARCH_TYPES[0]);
  const [depth, setDepth] = useState('3');
  const [urgency, setUrgency] = useState(URGENCY_LEVELS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      alert('Research topic cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    const success = await onSubmit({ topic, type, depth, urgency });
    
    setIsSubmitting(false);
    if (success) {
      setSubmitMessage('Research request submitted successfully!');
      // Reset form
      setTopic('');
      setType(RESEARCH_TYPES[0]);
      setDepth('3');
      setUrgency(URGENCY_LEVELS[0]);
      setTimeout(() => setSubmitMessage(null), 3000); // Clear message after 3 seconds
    } else {
      setSubmitMessage('Submission failed. Please try again.');
       setTimeout(() => setSubmitMessage(null), 3000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">New Research Request</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">
            Research Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 transition"
            placeholder="e.g., AI in e-commerce"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">
            Research Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 transition"
          >
            {RESEARCH_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="depth" className="block text-sm font-medium text-slate-700 mb-1">
            Depth Level: <span className="font-bold text-primary-600">{depth}</span>
          </label>
          <input
            type="range"
            id="depth"
            min="1"
            max="5"
            step="1"
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
           <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Overview</span>
            <span>In-depth</span>
          </div>
        </div>

        <div>
          <label htmlFor="urgency" className="block text-sm font-medium text-slate-700 mb-1">
            Urgency
          </label>
          <select
            id="urgency"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 transition"
          >
            {URGENCY_LEVELS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center bg-primary-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-primary-700 transition-colors disabled:bg-primary-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
               <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>Processing...</>
            ) : (
                <>🚀 Start Research</>
            )}
          </button>
        </div>
        {submitMessage && <p className="text-sm text-center text-green-600 mt-4">{submitMessage}</p>}
      </form>
    </div>
  );
};

export default ResearchForm;
