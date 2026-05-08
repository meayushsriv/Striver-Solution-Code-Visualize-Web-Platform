import { Clock3, FolderTree, Search, Star } from "lucide-react";
import { useMemo } from "react";
import { useAppStore } from "../store/appStore";
import { cn } from "../lib/utils";

export function Sidebar() {
  const {
    filteredProblems,
    selectedProblem,
    search,
    selectedTopic,
    selectedDifficulty,
    recentIds,
    favorites,
    setSearch,
    setTopic,
    setDifficulty,
    selectProblem
  } = useAppStore();

  const topics = useMemo(() => ["All", ...new Set(filteredProblems.map((p) => p.topic))], [filteredProblems]);
  const difficulties = ["All", "Easy", "Medium", "Hard", "Unknown"];

  return (
    <aside className="panel h-full min-w-[270px] max-w-[340px] p-4">
      <div className="mb-4 flex items-center gap-2 text-slate-300">
        <FolderTree className="h-4 w-4 text-cyan-300" />
        <h2 className="text-sm font-medium">Strivers Explorer</h2>
      </div>

      <label className="mb-3 flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Fuzzy search problems..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
        />
      </label>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <select
          value={selectedTopic}
          onChange={(e) => setTopic(e.target.value)}
          className="rounded-lg border border-white/10 bg-slate-900/80 px-2 py-2 text-xs"
        >
          {topics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
        <select
          value={selectedDifficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="rounded-lg border border-white/10 bg-slate-900/80 px-2 py-2 text-xs"
        >
          {difficulties.map((difficulty) => (
            <option key={difficulty}>{difficulty}</option>
          ))}
        </select>
      </div>

      <div className="mb-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-slate-500">
        <span className="flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5" />
          Recent
        </span>
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5" />
          {favorites.length}
        </span>
      </div>

      <div className="space-y-2 overflow-y-auto pb-4 pr-1">
        {filteredProblems.map((problem) => (
          <button
            key={problem.id}
            onClick={() => selectProblem(problem.id)}
            className={cn(
              "w-full rounded-xl border px-3 py-3 text-left transition",
              selectedProblem?.id === problem.id
                ? "border-cyan-400/50 bg-cyan-400/10"
                : "border-white/5 bg-slate-900/70 hover:border-white/20 hover:bg-slate-800/80"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="line-clamp-1 text-sm font-medium">{problem.title}</p>
              <span className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">
                {problem.difficulty}
              </span>
            </div>
            <p className="mt-1 line-clamp-1 text-xs text-slate-400">{problem.relativePath}</p>
            {recentIds.includes(problem.id) ? <p className="mt-1 text-[10px] text-cyan-300">recently viewed</p> : null}
          </button>
        ))}
      </div>
    </aside>
  );
}
