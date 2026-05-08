# Striver Solution Code Visualizer

Premium React + Vite competitive programming workspace for searching, reading, and visualizing local Striver solutions.

## Features

- Auto-index local `Strivers` folder into `public/strivers-index.json`
- Fuzzy search + topic and difficulty filters
- Multi-panel debugger-like layout
- Monaco editor with minimap and line highlight
- Mock execution engine with timeline and variable tracker
- Flow visualization canvas (React Flow)
- Command palette (`Ctrl+K`)
- Local persistence: notes, favorites, recently viewed
- Dark premium UI with smooth motion (Framer Motion)

## Stack

- React + Vite + TypeScript
- TailwindCSS (v4)
- Zustand
- Framer Motion
- Monaco Editor
- React Flow
- Radix UI primitives

## Run Locally

```bash
npm install
npm run dev
```

`npm run dev` runs `sync:strivers` automatically before startup.

## Build

```bash
npm run build
```

## Architecture

- `scripts/generate-strivers-index.mjs`: scans local `Strivers` folder and generates metadata/code index.
- `src/store/appStore.ts`: global app state for explorer, notes, playback, and UI controls.
- `src/components/*`: panel-based UI and interaction surface.
- `src/lib/mockExecution.ts`: mock execution timeline generator.
- `src/services/ai.ts`: AI explanation integration stub.
