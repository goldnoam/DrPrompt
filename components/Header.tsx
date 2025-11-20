import React from 'react';
import { Terminal, Wand2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="text-center py-12 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary-500/20 blur-[100px] -z-10 rounded-full pointer-events-none"></div>
      
      <div className="inline-flex items-center justify-center gap-3 mb-4 p-2 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <Terminal className="w-5 h-5 text-primary-400" />
        <span className="text-sm font-medium text-slate-300 tracking-wide">AI PROMPT ENGINEER</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
        Dr. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Prompt</span>
      </h1>
      
      <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
        Stop guessing. Get scientifically optimized prompts tailored for <br className="hidden md:block"/>
        Gemini, ChatGPT, Claude, and Grok.
      </p>
    </div>
  );
};