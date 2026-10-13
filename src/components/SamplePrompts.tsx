import React from 'react';
import { HelpCircle } from 'lucide-react';

interface SamplePromptsProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

const SAMPLE_TEXTS = [
  {
    label: 'Delayed Project Update',
    text: 'Hey team, the deployment got blocked because of an issue in the auth service. We are working on it now and hope to finish by 4 PM today.',
  },
  {
    label: 'Asking for Feedback',
    text: 'Can you check my proposal document when you have some time and tell me what you think before I send it to the client tomorrow?',
  },
  {
    label: 'Declining a Meeting',
    text: 'I cannot make it to the sprint planning session on Thursday morning because I have a doctor appointment, but I will review the notes after.',
  },
  {
    label: 'Technical Explanation',
    text: 'The database query was taking 12 seconds because of a missing index on the user_id column, causing a full table scan across 2 million records.',
  },
];

export const SamplePrompts: React.FC<SamplePromptsProps> = ({ onSelect, disabled }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <span className="text-xs text-slate-500 font-medium inline-flex items-center gap-1">
        <HelpCircle className="w-3.5 h-3.5" /> Try an example:
      </span>
      {SAMPLE_TEXTS.map((sample, idx) => (
        <button
          key={idx}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(sample.text)}
          className="text-xs bg-slate-100/90 hover:bg-slate-200/90 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors disabled:opacity-50"
        >
          {sample.label}
        </button>
      ))}
    </div>
  );
};
