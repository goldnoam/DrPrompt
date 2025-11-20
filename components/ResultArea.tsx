import React, { useState } from 'react';
import { Copy, Check, Sparkles, Info, Share2, List } from 'lucide-react';
import { RefinedResult } from '../types';

interface ResultAreaProps {
  result: RefinedResult | null;
}

export const ResultArea: React.FC<ResultAreaProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.refinedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Refined Prompt by Dr. Prompt',
          text: result.refinedPrompt,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support share API
      handleCopy();
      alert("Sharing is not supported on this browser/device. The prompt has been copied to your clipboard instead.");
    }
  };

  const canShare = typeof navigator.share === 'function';

  // Parse explanation into list items if it contains newlines or bullet markers
  const renderExplanation = (text: string) => {
    // Split by newline
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    // Check if lines look like a list (start with -, *, •, or numbers)
    const isList = lines.length > 1 || lines.some(line => /^[-\*•\d\.]/.test(line.trim()));

    if (isList) {
      return (
        <ul className="list-none space-y-2 mt-1">
          {lines.map((line, index) => {
            // Remove common bullet markers for cleaner display
            const cleanLine = line.replace(/^[-\*•]\s*/, '').trim();
            return (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-400 leading-relaxed">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-primary-500 flex-shrink-0" />
                <span>{cleanLine}</span>
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <p className="text-sm text-slate-400 leading-relaxed">
        {text}
      </p>
    );
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Refined Prompt Section */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2 px-1">
          <label className="text-sm font-medium text-primary-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Refined Prompt
          </label>
          
          <div className="flex items-center gap-2">
            {canShare && (
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-dark-800 text-slate-300 hover:bg-primary-500/20 hover:text-primary-300 transition-all"
                title="Share prompt"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            )}
            
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-dark-800 text-slate-300 hover:bg-primary-500/20 hover:text-primary-300 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </button>
          </div>
        </div>

        <div className="relative rounded-xl bg-dark-900/50 border border-primary-500/30 shadow-[0_0_30px_-10px_rgba(79,70,229,0.15)] overflow-hidden">
          {/* Decoration Top Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"></div>
          
          <div className="p-6">
            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-200 leading-loose">
              {result.refinedPrompt}
            </pre>
          </div>
        </div>
      </div>

      {/* Explanation Section */}
      <div className="rounded-lg bg-dark-800/30 border border-white/5 p-4">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="w-full">
             <h4 className="text-sm font-bold text-slate-300 mb-2">Why this works better:</h4>
             {renderExplanation(result.explanation)}
          </div>
        </div>
      </div>

    </div>
  );
};
