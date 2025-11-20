import React from 'react';
import { Mail, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-12 border-t border-white/5 bg-dark-950">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="text-sm text-slate-500 font-medium">
          &copy; Noam Gold AI 2025
        </div>

        <div className="flex items-center gap-6">
          <a 
            href="mailto:gold.noam@gmail.com" 
            className="group flex items-center gap-2 text-sm text-slate-400 hover:text-primary-400 transition-colors"
          >
            <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Send Feedback
          </a>
          <span className="text-dark-800">|</span>
          <span className="text-sm text-slate-600 font-mono">gold.noam@gmail.com</span>
        </div>

      </div>
    </footer>
  );
};