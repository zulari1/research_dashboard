
import React from 'react';
import type { ResearchResult } from '../types';
import CheckIcon from './icons/CheckIcon';
import ClockIcon from './icons/ClockIcon';
import PdfIcon from './icons/PdfIcon';

interface ResultCardProps {
  result: ResearchResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const isCompleted = result.status === 'Completed';

  return (
    <div className="border border-slate-200 rounded-lg p-4 transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {isCompleted ? (
              <CheckIcon className="h-6 w-6 text-green-500" />
            ) : (
              <ClockIcon className="h-6 w-6 text-amber-500" />
            )}
            <h3 className="text-lg font-semibold text-slate-800">{result.topic}</h3>
          </div>

          {isCompleted ? (
            <p className="text-sm text-slate-500 ml-9">📅 Completed {result.completedAt}</p>
          ) : (
            <div className="ml-9 space-y-2">
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${result.progress || 0}%` }}></div>
                </div>
                 <div className="flex justify-between text-xs text-slate-500">
                    <span>{result.progress || 0}% Complete</span>
                    <span>{result.timeRemaining} remaining</span>
                </div>
            </div>
          )}
        </div>
        
        {result.pdfUrl && (
          <a
            href={result.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 flex items-center space-x-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            <PdfIcon className="h-4 w-4" />
            <span>View PDF</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
