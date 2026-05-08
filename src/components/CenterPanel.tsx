import * as Tabs from "@radix-ui/react-tabs";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { useAppStore } from "../store/appStore";
import { explainWithAi } from "../services/ai";

export function CenterPanel() {
  const { selectedProblem, notes, setNote, favorites, toggleFavorite } = useAppStore();
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const getAiExplanation = async () => {
    if (!selectedProblem) return;
    setLoading(true);
    try {
      const explanation = await explainWithAi({
        code: selectedProblem.code,
        language: selectedProblem.language,
        question: "Provide a detailed explanation of this algorithm and its approach."
      });
      setAiExplanation(explanation);
    } catch (error) {
      setAiExplanation("Error getting AI explanation.");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedProblem) {
    return (
      <section className="panel flex h-full items-center justify-center p-8 text-center text-slate-400">
        Select a problem from the explorer to begin.
      </section>
    );
  }

  return (
    <section className="panel h-full p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{selectedProblem.title}</h2>
          <p className="text-xs text-slate-400">{selectedProblem.relativePath}</p>
        </div>
        <button
          onClick={() => toggleFavorite(selectedProblem.id)}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
        >
          {favorites.includes(selectedProblem.id) ? "Favorited" : "Favorite"}
        </button>
      </div>

      <Tabs.Root defaultValue="solution" className="h-[calc(100%-4.5rem)]">
        <Tabs.List className="mb-4 grid grid-cols-4 rounded-xl border border-white/10 bg-slate-900/70 p-1 text-xs">
          {["solution", "visualization", "dry-run", "notes"].map((tab) => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className="rounded-lg px-2 py-2 capitalize text-slate-300 data-[state=active]:bg-white/10 data-[state=active]:text-cyan-300"
            >
              {tab.replace("-", " ")}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="solution" asChild>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ScrollArea.Root className="h-full">
              <ScrollArea.Viewport className="h-full">
                <div className="space-y-4 p-1">
                  <Card title="Problem Statement">{selectedProblem.statement}</Card>
                  <Card title="Approach">{selectedProblem.approach}</Card>
                  <Card title="Complexity">{`${selectedProblem.complexity.time} time • ${selectedProblem.complexity.space} space`}</Card>
                  <Card title="AI Explanation">
                    <button
                      onClick={getAiExplanation}
                      disabled={loading}
                      className="mb-2 rounded-lg bg-cyan-500 px-3 py-1 text-xs text-white disabled:opacity-50"
                    >
                      {loading ? "Loading..." : "Get AI Explanation"}
                    </button>
                    <p className="text-sm">{aiExplanation || "Click to get AI-powered explanation of the approach."}</p>
                  </Card>
                </div>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar orientation="vertical" />
            </ScrollArea.Root>
          </motion.div>
        </Tabs.Content>

        <Tabs.Content value="visualization" asChild>
          <ScrollArea.Root className="h-full">
            <ScrollArea.Viewport className="h-full p-4">
              <Card title="Visualization Flow">Use the right panel controls to animate state and inspect variable transitions.</Card>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical" />
          </ScrollArea.Root>
        </Tabs.Content>

        <Tabs.Content value="dry-run" asChild>
          <ScrollArea.Root className="h-full">
            <ScrollArea.Viewport className="h-full p-4">
              <Card title="Dry Run Guide">
                Provide custom input, run mock execution timeline, and inspect each step with line highlighting and variable
                tracker.
              </Card>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical" />
          </ScrollArea.Root>
        </Tabs.Content>

        <Tabs.Content value="notes" asChild>
          <ScrollArea.Root className="h-full">
            <ScrollArea.Viewport className="h-full p-4">
              <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                <p className="mb-2 text-xs text-slate-400">Your personal notes are persisted locally.</p>
                <textarea
                  className="h-60 w-full resize-none rounded-lg border border-white/10 bg-slate-950/70 p-3 text-sm outline-none"
                  value={notes[selectedProblem.id] ?? ""}
                  onChange={(e) => setNote(selectedProblem.id, e.target.value)}
                  placeholder="Write your intuition, edge cases, and revision tips..."
                />
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical" />
          </ScrollArea.Root>
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <div className="text-sm leading-relaxed text-slate-200">{children}</div>
    </div>
  );
}
