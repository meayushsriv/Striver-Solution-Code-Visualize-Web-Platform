export type AiExplainRequest = {
  code: string;
  line?: number;
  language: string;
  question?: string;
};

export async function explainWithAi(_request: AiExplainRequest): Promise<string> {
  return "AI integration placeholder: connect your preferred LLM provider here for line-level explanations and approach summaries.";
}
