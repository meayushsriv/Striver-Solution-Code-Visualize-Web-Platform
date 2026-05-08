import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function fuzzyScore(query: string, text: string): number {
  if (!query.trim()) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return q.length * 2;
  let score = 0;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i += 1) {
    if (t[i] === q[qi]) {
      score += 1;
      qi += 1;
    }
  }
  return qi === q.length ? score : -1;
}
