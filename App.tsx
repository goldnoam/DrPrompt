import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ModelSelector } from './components/ModelSelector';
import { InputArea } from './components/InputArea';
import { ResultArea } from './components/ResultArea';
import { HistoryList } from './components/HistoryList';
import { TargetModel, RefinedResult, HistoryItem } from './types';
import { refineUserPrompt } from './services/geminiService';

function App() {
  const [selectedModel, setSelectedModel] = useState<TargetModel>(TargetModel.Gemini);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [result, setResult] = useState<RefinedResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('drPromptHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('drPromptHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (original: string, refined: RefinedResult, model: TargetModel) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      originalPrompt: original,
      targetModel: model,
      result: refined
    };
    
    setHistory(prev => [newItem, ...prev].slice(0, 20)); // Keep last 20 items
  };

  const handleRefine = async () => {
    if (!inputPrompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await refineUserPrompt(inputPrompt, selectedModel);
      setResult(response);
      addToHistory(inputPrompt, response, selectedModel);
    } catch (err) {
      console.error(err);
      setError("Failed to refine prompt. Please try again or check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputPrompt('');
    setResult(null);
    setError(null);
  };

  // History Handlers
  const handleSelectHistory = (item: HistoryItem) => {
    setInputPrompt(item.originalPrompt);
    setSelectedModel(item.targetModel);
    setResult(item.result);
    // Scroll to top to see result
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your history?")) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 selection:bg-primary-500/30 selection:text-primary-200">
      
      <div className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        
        <Header />

        <main className="flex-grow w-full relative z-10">
          
          <ModelSelector 
            selectedModel={selectedModel} 
            onSelect={setSelectedModel} 
          />

          <div className="grid grid-cols-1 gap-8">
            {/* Input Section */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              <InputArea 
                value={inputPrompt} 
                onChange={setInputPrompt} 
                onRefine={handleRefine}
                isLoading={isLoading}
                onClear={handleClear}
              />
            </section>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-pulse">
                {error}
              </div>
            )}

            {/* Result Section */}
            {result && (
               <ResultArea result={result} />
            )}

            {/* History Section */}
            <HistoryList 
              history={history} 
              onSelect={handleSelectHistory} 
              onDelete={handleDeleteHistoryItem}
              onClear={handleClearHistory}
            />
          </div>

        </main>

      </div>

      <Footer />
      
      {/* Background Noise/Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay" 
           style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}>
      </div>
    </div>
  );
}

export default App;
