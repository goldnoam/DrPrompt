import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, Copy, Check } from 'lucide-react';

interface InputAreaProps {
  value: string;
  onChange: (val: string) => void;
  onRefine: () => void;
  isLoading: boolean;
  onClear: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ value, onChange, onRefine, isLoading, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (typeof event.target?.result === 'string') {
            onChange(event.target.result);
          }
        };
        reader.readAsText(file);
      } else {
        alert("Please drop a text file (.txt, .md, .json, etc.)");
      }
    }
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      onRefine();
    }
  };

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-end mb-2 px-1">
        <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Original Prompt
        </label>
        
        <div className="flex items-center gap-2">
          {value && (
            <>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-slate-500 hover:text-primary-400 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <span className="text-slate-700">|</span>
              <button 
                onClick={onClear}
                className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-slate-500 hover:text-red-400 transition-colors"
                title="Clear prompt"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            </>
          )}
        </div>
      </div>
      
      <div 
        className={`
          relative group transition-all duration-300 rounded-xl p-1
          ${isDragging 
            ? 'bg-gradient-to-r from-primary-500 to-purple-600 p-[2px]' 
            : 'bg-dark-800'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`
          relative w-full h-64 rounded-xl bg-dark-950 border-2 transition-all duration-200 overflow-hidden
          ${isDragging ? 'border-transparent opacity-90' : 'border-dark-800 group-hover:border-dark-700'}
        `}>
           <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDragging ? "Drop text file here..." : "Enter your prompt here, or drag & drop a text file..."}
            className="w-full h-full p-6 bg-transparent text-slate-200 placeholder-slate-600 resize-none focus:outline-none font-mono text-sm leading-relaxed"
          />
          
          {/* Drag Overlay Hint */}
          <div className={`
            absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-dark-950/80 backdrop-blur-sm transition-opacity duration-300
            ${isDragging ? 'opacity-100' : 'opacity-0'}
          `}>
            <Upload className="w-12 h-12 text-primary-500 mb-2 animate-bounce" />
            <p className="text-primary-400 font-bold">Drop file to load content</p>
          </div>

        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onRefine}
          disabled={!value.trim() || isLoading}
          className={`
            relative overflow-hidden rounded-lg px-8 py-3 font-bold text-white transition-all duration-300
            ${!value.trim() || isLoading 
              ? 'bg-dark-800 text-slate-600 cursor-not-allowed' 
              : 'bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-600/30 hover:shadow-primary-500/50 active:scale-95'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Refining...
            </span>
          ) : (
             <span className="flex items-center gap-2">
               Refine Prompt <span className="text-xs opacity-60 bg-white/20 px-1.5 py-0.5 rounded">Cmd+Enter</span>
             </span>
          )}
        </button>
      </div>
    </div>
  );
};