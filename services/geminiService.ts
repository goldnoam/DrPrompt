import { GoogleGenAI, Type } from "@google/genai";
import { TargetModel, RefinedResult } from "../types";

const apiKey = process.env.API_KEY;

// Initialize the client outside the function if the key is static, 
// but since we are in a generated environment, best practice is to check key existence inside usage or init.
// We will init inside the function to ensure fresh environment access if needed, or global if guaranteed.
// Following guidelines: "Assume this variable is pre-configured... accessible... where the API client is initialized."

const ai = new GoogleGenAI({ apiKey: apiKey });

export const refineUserPrompt = async (
  originalPrompt: string, 
  targetModel: TargetModel
): Promise<RefinedResult> => {
  
  const modelName = 'gemini-2.5-flash'; 

  const systemInstruction = `You are Dr. Prompt, a world-class prompt engineer expert in the nuances of Large Language Models.
  
  Your task is to rewrite the user's raw prompt into a highly optimized prompt specifically tailored for the architecture and fine-tuning quirks of the target model: ${targetModel}.
  
  Guidelines per model:
  - Gemini: Prefers structured input, clear context, multi-modal hints if relevant, and explicit constraints.
  - ChatGPT: Responds well to persona adoption ("Act as..."), Chain-of-Thought (step-by-step), and conversational clarity.
  - Claude: Highly logical. Prefers XML tags for separation of instructions and data (e.g., <instruction>...</instruction>, <data>...</data>). Very literal interpretation.
  - Grok: Likes a direct, sometimes witty or "unhinged" style depending on context, but appreciates raw directness and minimal fluff.
  
  Output must be a JSON object containing:
  1. 'refinedPrompt': The optimized prompt ready for copy-pasting.
  2. 'explanation': A brief, bullet-point explanation of what techniques you used (e.g., "Added XML tags for Claude stability").
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: originalPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedPrompt: {
              type: Type.STRING,
              description: "The rewritten, optimized prompt.",
            },
            explanation: {
              type: Type.STRING,
              description: "Brief explanation of the optimization techniques used.",
            },
          },
          required: ["refinedPrompt", "explanation"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as RefinedResult;
    } else {
      throw new Error("Empty response from AI");
    }
  } catch (error) {
    console.error("Error refining prompt:", error);
    throw error;
  }
};