export enum TargetModel {
  Gemini = 'Gemini',
  ChatGPT = 'ChatGPT',
  Claude = 'Claude',
  Grok = 'Grok'
}

export interface RefinedResult {
  refinedPrompt: string;
  explanation: string;
}

export interface ModelConfig {
  id: TargetModel;
  name: string;
  iconName: string; // We will map this to Lucide icons in the component
  color: string;
  description: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  originalPrompt: string;
  targetModel: TargetModel;
  result: RefinedResult;
}
