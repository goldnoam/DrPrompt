import React from 'react';
import { HistoryItem, TargetModel } from '../types';
import { Clock, Trash2, ArrowUpRight, Sparkles, Bot, Brain, Zap, RotateCcw } from 'lucide-react';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const IconMap: Record<TargetModel, React.FC<{ className?: string }>> = {
  [TargetModel.Gemini]: Sparkles,
  [TargetModel.ChatGPT]: Bot,
  [TargetModel.Claude]: Brain,
  [TargetModel.Grok]: Zap,
};

const ColorMap: Record<TargetModel, string> = {
  [TargetModel.Gemini]: 'text-blue-400 bg-blue-400/10',
  [TargetModel.ChatGPT]: 'text-green-400 bg-green-400/10',
  [TargetModel.Claude]: 'text-orange-400 bg-orange-400/10',
  [TargetModel.Grok]: 'text-slate-300 bg-slate-400/10',
};

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onDelete, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full mt-12 pt-8 border-t border-white/5 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-500" />
          Recent Refinements
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5"
        >
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {history.map((item) => {
          const Icon = IconMap[item.targetModel];
          const colorClass = ColorMap[item.targetModel];

          return (
            <div 
              key={item.id}
              className="group relative bg-dark-900/40 border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all duration-200 hover:bg-dark-800/60 flex flex-col sm:flex-row gap-4"
            >
              {/* Icon Header */}
              <div className="flex sm:flex-col items-center sm:items-start justify-between gap-3 min-w-[100px]">
                <div className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium ${colorClass}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {item.targetModel}
                </div>
                <span className="text-xs text-slate-600 font-mono">
                  {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>

              {/* Content Preview */}
              <div className="flex-grow min-w-0 cursor-pointer" onClick={() => onSelect(item)}>
                 <div className="mb-1.5">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Original</p>
                    <p className="text-sm text-slate-400 truncate">{item.originalPrompt}</p>
                 </div>
                 <div>
                    <p className="text-xs text-primary-500/70 font-medium uppercase tracking-wider mb-0.5">Refined</p>
                    <p className="text-sm text-slate-200 font-mono truncate">{item.result.refinedPrompt}</p>
                 </div>
              </div>

              {/* Actions */}
              <div className="flex items-center sm:flex-col justify-end gap-2 pl-2 sm:border-l sm:border-white/5">
                <button
                  onClick={() => onSelect(item)}
                  className="p-2 rounded-lg text-slate-500 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                  title="Restore this result"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Delete from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
