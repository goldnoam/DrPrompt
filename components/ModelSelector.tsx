import React from 'react';
import { TargetModel, ModelConfig } from '../types';
import { Sparkles, Bot, Brain, Zap } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: TargetModel;
  onSelect: (model: TargetModel) => void;
}

const models: ModelConfig[] = [
  {
    id: TargetModel.Gemini,
    name: 'Gemini',
    iconName: 'Sparkles',
    color: 'from-blue-500 to-purple-500',
    description: 'Optimized for Google\'s multimodal architecture.'
  },
  {
    id: TargetModel.ChatGPT,
    name: 'ChatGPT',
    iconName: 'Bot',
    color: 'from-green-500 to-emerald-600',
    description: 'Tailored for OpenAI\'s conversational style.'
  },
  {
    id: TargetModel.Claude,
    name: 'Claude',
    iconName: 'Brain',
    color: 'from-orange-500 to-amber-600',
    description: 'Formatted with XML tags for Anthropic\'s logic.'
  },
  {
    id: TargetModel.Grok,
    name: 'Grok',
    iconName: 'Zap',
    color: 'from-slate-100 to-slate-400',
    description: 'Direct and witty style for xAI.'
  },
];

const IconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Bot,
  Brain,
  Zap
};

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {models.map((model) => {
        const Icon = IconMap[model.iconName];
        const isSelected = selectedModel === model.id;
        
        return (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={`
              relative group flex flex-col items-start p-5 rounded-xl transition-all duration-300 border
              ${isSelected 
                ? 'bg-white/10 border-primary-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                : 'bg-dark-800/50 border-white/5 hover:bg-dark-800 hover:border-white/10'
              }
            `}
          >
            <div className={`
              p-3 rounded-lg mb-3 transition-all duration-300
              ${isSelected ? `bg-gradient-to-br ${model.color} text-white` : 'bg-dark-900 text-slate-400 group-hover:text-slate-200'}
            `}>
              <Icon className="w-6 h-6" />
            </div>
            
            <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
              {model.name}
            </h3>
            <p className="text-xs text-slate-500 text-left leading-relaxed">
              {model.description}
            </p>

            {/* Selection Ring Animation */}
            {isSelected && (
              <div className="absolute inset-0 border-2 border-primary-500/30 rounded-xl animate-pulse pointer-events-none" />
            )}
          </button>
        );
      })}
    </div>
  );
};