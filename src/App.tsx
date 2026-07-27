import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Command } from "lucide-react";
import { HomeHero } from "./components/HomeHero";
import { Sidebar } from "./components/Sidebar";
import { CenterPanel } from "./components/CenterPanel";
import { RightPanel } from "./components/RightPanel";
import { CommandPalette } from "./components/CommandPalette";
import { useAppStore } from "./store/appStore";
import type { Problem } from "./types";

export function App() {
  const {
    initialized,
    problems,
    selectedProblem,
    timeline,
    currentStep,
    isPlaying,
    speed,
    nextStep,
    setPlaying,
    loadProblems,
    setCommandPaletteOpen,
  } = useAppStore();

  useEffect(() => {
    const indexUrl = `${import.meta.env.BASE_URL}strivers-index.json`;
    void fetch(indexUrl)
      .then((res) => res.json())
      .then((data) => loadProblems((data.problems ?? []) as Problem[]))
      .catch(() => loadProblems([]));
  }, [loadProblems]);

  useEffect(() => {
    if (!isPlaying || timeline.length === 0) return;
    const timer = setTimeout(() => {
      if (currentStep >= timeline.length - 1) {
        setPlaying(false);
      } else {
        nextStep();
      }
    }, 1000 / speed);
    return () => clearTimeout(timer);
  }, [isPlaying, timeline.length, currentStep, speed, nextStep, setPlaying]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setCommandPaletteOpen]);

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-slate-100">
      <div className="mx-auto max-w-[1800px] space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Striver Code Visualizer
            </p>
            <p className="text-sm text-slate-300">
              Premium local DSA workspace{" "}
              {selectedProblem ? `• ${selectedProblem.title}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-300">
              {problems.length} indexed solutions
            </div>
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-300"
            >
              <Command className="h-4 w-4 text-cyan-300" />
              Command Palette
            </button>
          </div>
        </header>

        <HomeHero total={problems.length} />

        <AnimatePresence mode="wait">
          {!initialized ? (
            <motion.div key="loading" className="panel h-80 animate-pulse" />
          ) : (
            <motion.div
              key="layout"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid h-[calc(100vh-16.5rem)] grid-cols-1 gap-3 md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr_400px]"
            >
              <Sidebar />
              <CenterPanel />
              <RightPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <CommandPalette />
    </main>
  );
}
