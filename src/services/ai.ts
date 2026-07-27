import { GoogleGenerativeAI } from "@google/generative-ai";

export type AiExplainRequest = {
  code: string;
  line?: number;
  language: string;
  question?: string;
};

const fallbackApiKey = "AIzaSyCb0xGaCv3-EOXGRbyYip7sTzDHdQycG8Y";
const modelCandidates = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];

function buildPrompt(request: AiExplainRequest): string {
  let prompt = `Explain the following ${request.language} code in a concise but helpful way.`;

  if (typeof request.line === "number") {
    const lines = request.code.split("\n");
    const lineContent = lines[request.line - 1] || "";
    prompt += ` Focus on line ${request.line}: "${lineContent}".`;
  }

  if (request.question) {
    prompt += ` Additional question: ${request.question}`;
  }

  prompt += `\n\nCode:\n${request.code}`;
  return prompt;
}

function normalizeResponse(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
}

export async function explainWithAi(request: AiExplainRequest): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || fallbackApiKey;

  if (!apiKey) {
    return "Please set your Gemini API key in the environment variables.";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    let lastError: unknown;

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(buildPrompt(request));
        const response = await result.response;
        const text = normalizeResponse(response.text());
        if (text) {
          return text;
        }
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError ?? new Error("No Gemini model responded");
  } catch (error) {
    console.error("AI explanation error:", error);
    return "AI is unavailable right now. Please check the API key or try again in a moment.";
  }
}
