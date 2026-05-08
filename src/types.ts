export type Language = "cpp" | "java" | "python" | "sql" | "javascript" | "typescript";

export type Problem = {
  id: string;
  title: string;
  fileName: string;
  relativePath: string;
  language: Language;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Unknown";
  tags: string[];
  statement: string;
  approach: string;
  complexity: {
    time: string;
    space: string;
  };
  code: string;
  updatedAt: string;
};

export type ExecutionStep = {
  id: number;
  line: number;
  action: string;
  variables: Record<string, string | number | boolean>;
  focus: string;
};
