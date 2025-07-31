
import React from 'react';
import type { ResearchResult } from '../types';
import ResultCard from './ResultCard';
import Spinner from './Spinner';

interface ResearchResultsProps {
  results: ResearchResult[];
  isLoading: boolean;
}

const ResearchResults: React.FC<ResearchResultsProps> = ({ results, isLoading }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 h-full">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Research</h2>
      {isLoading && results.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <Spinner />
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-500">You haven't submitted any research requests yet.</p>
          <p className="text-slate-500">Use the form to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearchResults;
