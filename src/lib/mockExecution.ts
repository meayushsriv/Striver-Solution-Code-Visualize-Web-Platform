import type { ExecutionStep, Problem } from "../types";

export function buildMockTimeline(problem: Problem, input: string): ExecutionStep[] {
  const lines = problem.code.split("\n");
  const baseArray = input
    .split(/\s+/)
    .map((x) => Number(x))
    .filter((x) => Number.isFinite(x));
  const arr = baseArray.length > 0 ? baseArray : [5, 2, 7, 1, 9];

  return lines.slice(0, 10).map((_, idx) => ({
    id: idx,
    line: idx + 1,
    action: idx === 0 ? "Initialize state" : `Evaluate line ${idx + 1}`,
    variables: {
      i: Math.min(idx, arr.length - 1),
      n: arr.length,
      current: arr[Math.min(idx, arr.length - 1)] ?? 0,
      best: Math.max(...arr.slice(0, Math.min(idx + 1, arr.length)))
    },
    focus: idx % 2 === 0 ? "array" : "pointer"
  }));
}
