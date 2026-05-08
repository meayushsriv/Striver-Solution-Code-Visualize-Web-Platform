import { GoogleGenerativeAI } from "@google/generative-ai";

export type AiExplainRequest = {
  code: string;
  line?: number;
  language: string;
  question?: string;
};

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export async function explainWithAi(request: AiExplainRequest): Promise<string> {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return "Please set your GEMINI_API_KEY in environment variables.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = `Explain the following ${request.language} code`;
    if (request.line) {
      const lines = request.code.split('\n');
      const lineContent = lines[request.line - 1] || '';
      prompt += `, specifically line ${request.line}: "${lineContent}"`;
    }
    if (request.question) {
      prompt += `. Additional question: ${request.question}`;
    }
    prompt += `.\n\nCode:\n${request.code}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI explanation error:", error);
    return "Failed to get AI explanation. Check your API key and try again.";
  }
}
