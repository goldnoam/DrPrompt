import { GoogleGenAI, Type } from "@google/genai";
import { TargetModel, RefinedResult } from "../types";

const apiKey = process.env.API_KEY;

// Initialize the client
const ai = new GoogleGenAI({ apiKey: apiKey });

const getSystemInstruction = (targetModel: TargetModel): string => {
  const baseInstruction = `You are Dr. Prompt, a world-class prompt engineer expert in the nuances of Large Language Models.
  
  Your task is to rewrite the user's raw prompt into a highly optimized prompt specifically tailored for the architecture and fine-tuning quirks of the target model: ${targetModel}.`;

  const guidelines: Record<string, string> = {
    [TargetModel.Gemini]: `
    TARGET MODEL: Google Gemini (Pro/Flash)
    SPECIFIC OPTIMIZATION RULES:
    1. Structure & Formatting: Gemini excels with structured inputs. Use Markdown headers, clear sections, and bullet points.
    2. Context Window: Gemini has a massive context window. Encourage verbose, detailed context if the user provided it, but organize it well.
    3. Constraints: Be explicit about what NOT to do. Gemini adheres strictly to negative constraints.
    4. Safety: Ensure the prompt is framed safely to avoid triggering safety filters unnecessarily.
    5. Output Format: Define the expected output format clearly (e.g., "Return a JSON list...", "Write a blog post...").
    `,
    [TargetModel.ChatGPT]: `
    TARGET MODEL: OpenAI ChatGPT (GPT-4o/o1)
    SPECIFIC OPTIMIZATION RULES:
    1. Persona Adoption: Start with "Act as a [Role]..." or "You are an expert in...". This primes the model's latent space effectively.
    2. Chain-of-Thought: For complex tasks, explicitly add "Think step-by-step" or "Explain your reasoning before giving the final answer."
    3. Delimiters: Use delimiters like triple quotes (""") or separators to clearly distinguish input data from instructions.
    4. Conversational Tone: ChatGPT optimizes for chat. The prompt can use natural language instructions but should remain precise.
    5. Clarity: Remove ambiguity. If constraints are needed, list them at the end.
    `,
    [TargetModel.Claude]: `
    TARGET MODEL: Anthropic Claude (3.5 Sonnet / 3.7)
    SPECIFIC OPTIMIZATION RULES:
    1. XML Tags: THIS IS CRITICAL. Claude is fine-tuned to pay special attention to XML tags. Enclose context in <context>, data in <data>, and instructions in <instructions>.
    2. No "Fluff": Claude prefers direct, logical instructions over "Act as..." personas, though personas can still work. Prioritize functional descriptions.
    3. "Prefill" Technique: If the prompt asks for code, suggest starting the response with \`\`\`javascript (etc).
    4. Thinking: Encourage it to "think" in <thinking> tags before outputting the final answer in <answer> tags for complex logic.
    5. Separation: Keep instructions distinct from the content to be processed.
    `,
    [TargetModel.Grok]: `
    TARGET MODEL: xAI Grok
    SPECIFIC OPTIMIZATION RULES:
    1. Directness: Grok prefers a "no-nonsense" approach. Cut the preamble.
    2. Style: Depending on the prompt's intent, Grok can handle "spicy" or "witty" requests. If the user's prompt implies a casual tone, lean into it.
    3. Real-time info: If the prompt relies on current events, explicitly instruct Grok to look up the latest info (simulated in the prompt structure by asking for "latest data").
    4. Robustness: Grok is designed to be less restrictive. You can be more direct with controversial topics (within safety reason), avoiding preachy disclaimers.
    `
  };

  const generalRules = `
  Output must be a JSON object containing:
  1. 'refinedPrompt': The rewritten, optimized prompt.
  2. 'explanation': A brief, bullet-point explanation of what techniques you used (e.g., "Added XML tags for Claude stability").
  `;

  return `${baseInstruction}\n\n${guidelines[targetModel] || guidelines[TargetModel.Gemini]}\n\n${generalRules}`;
};

export const refineUserPrompt = async (
  originalPrompt: string, 
  targetModel: TargetModel
): Promise<RefinedResult> => {
  
  const modelName = 'gemini-2.5-flash'; 
  const systemInstruction = getSystemInstruction(targetModel);

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