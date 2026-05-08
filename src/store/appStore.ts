import { create } from "zustand";
import type { ExecutionStep, Problem } from "../types";
import { buildMockTimeline } from "../lib/mockExecution";
import { fuzzyScore } from "../lib/utils";

type AppState = {
  initialized: boolean;
  problems: Problem[];
  filteredProblems: Problem[];
  selectedProblem: Problem | null;
  search: string;
  selectedTopic: string;
  selectedDifficulty: string;
  recentIds: string[];
  favorites: string[];
  notes: Record<string, string>;
  timeline: ExecutionStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  commandPaletteOpen: boolean;
  loadProblems: (problems: Problem[]) => void;
  setSearch: (value: string) => void;
  setTopic: (value: string) => void;
  setDifficulty: (value: string) => void;
  selectProblem: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setNote: (id: string, value: string) => void;
  runMock: (input: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPlaying: (value: boolean) => void;
  setSpeed: (value: number) => void;
  setCommandPaletteOpen: (value: boolean) => void;
};

const storageKey = "striver-visualizer-state";

function loadPersisted() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return { favorites: [], notes: {}, recentIds: [] };
  try {
    const value = JSON.parse(raw);
    return {
      favorites: value.favorites ?? [],
      notes: value.notes ?? {},
      recentIds: value.recentIds ?? []
    };
  } catch {
    return { favorites: [], notes: {}, recentIds: [] };
  }
}

function persist(state: Pick<AppState, "favorites" | "notes" | "recentIds">) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function applyFilters(state: AppState) {
  const withScore = state.problems
    .map((problem) => ({
      problem,
      score: fuzzyScore(state.search, `${problem.title} ${problem.topic} ${problem.fileName}`)
    }))
    .filter(({ problem, score }) => {
      const topicOk = state.selectedTopic === "All" || problem.topic === state.selectedTopic;
      const diffOk = state.selectedDifficulty === "All" || problem.difficulty === state.selectedDifficulty;
      const searchOk = !state.search.trim() || score >= 0;
      return topicOk && diffOk && searchOk;
    })
    .sort((a, b) => b.score - a.score || a.problem.title.localeCompare(b.problem.title));
  return withScore.map(({ problem }) => problem);
}

const persisted = typeof window === "undefined" ? { favorites: [], notes: {}, recentIds: [] } : loadPersisted();

export const useAppStore = create<AppState>((set, get) => ({
  initialized: false,
  problems: [],
  filteredProblems: [],
  selectedProblem: null,
  search: "",
  selectedTopic: "All",
  selectedDifficulty: "All",
  recentIds: persisted.recentIds,
  favorites: persisted.favorites,
  notes: persisted.notes,
  timeline: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1,
  commandPaletteOpen: false,
  loadProblems: (problems) =>
    set((state) => {
      const selected = state.selectedProblem ?? problems[0] ?? null;
      const next = { ...state, initialized: true, problems, selectedProblem: selected } as AppState;
      return {
        initialized: true,
        problems,
        selectedProblem: selected,
        filteredProblems: applyFilters(next)
      };
    }),
  setSearch: (search) => set((state) => ({ search, filteredProblems: applyFilters({ ...state, search } as AppState) })),
  setTopic: (selectedTopic) =>
    set((state) => ({
      selectedTopic,
      filteredProblems: applyFilters({ ...state, selectedTopic } as AppState)
    })),
  setDifficulty: (selectedDifficulty) =>
    set((state) => ({
      selectedDifficulty,
      filteredProblems: applyFilters({ ...state, selectedDifficulty } as AppState)
    })),
  selectProblem: (id) =>
    set((state) => {
      const selectedProblem = state.problems.find((problem) => problem.id === id) ?? null;
      if (!selectedProblem) return {};
      const recentIds = [id, ...state.recentIds.filter((existingId) => existingId !== id)].slice(0, 8);
      persist({ favorites: state.favorites, notes: state.notes, recentIds });
      return {
        selectedProblem,
        recentIds,
        timeline: [],
        currentStep: 0,
        isPlaying: false
      };
    }),
  toggleFavorite: (id) =>
    set((state) => {
      const favorites = state.favorites.includes(id)
        ? state.favorites.filter((fav) => fav !== id)
        : [...state.favorites, id];
      persist({ favorites, notes: state.notes, recentIds: state.recentIds });
      return { favorites };
    }),
  setNote: (id, value) =>
    set((state) => {
      const notes = { ...state.notes, [id]: value };
      persist({ favorites: state.favorites, notes, recentIds: state.recentIds });
      return { notes };
    }),
  runMock: (input) =>
    set((state) => {
      if (!state.selectedProblem) return {};
      const timeline = buildMockTimeline(state.selectedProblem, input);
      return { timeline, currentStep: 0, isPlaying: false };
    }),
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, Math.max(0, state.timeline.length - 1))
    })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setSpeed: (speed) => set({ speed }),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen })
}));

