import Editor from "@monaco-editor/react";
import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Pause, Play, SkipBack, SkipForward, WandSparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { useAppStore } from "../store/appStore";
import { explainWithAi } from "../services/ai";

const nodes = [
  { id: "start", position: { x: 0, y: 0 }, data: { label: "Start" }, type: "input" },
  { id: "loop", position: { x: 30, y: 120 }, data: { label: "Loop / Transition" } },
  { id: "result", position: { x: 20, y: 240 }, data: { label: "Output" }, type: "output" }
];

const edges = [
  { id: "e1", source: "start", target: "loop", animated: true },
  { id: "e2", source: "loop", target: "result", animated: true }
];

export function RightPanel() {
  const { selectedProblem, timeline, currentStep, nextStep, prevStep, isPlaying, setPlaying, speed, setSpeed, runMock } =
    useAppStore();
  const [input, setInput] = useState("5 2 7 1 9");
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<any>(null);

  const current = timeline[currentStep];

  const decorations = useMemo(() => {
    const line = current?.line ?? 1;
    return [
      {
        range: {
          startLineNumber: line,
          endLineNumber: line,
          startColumn: 1,
          endColumn: 1
        },
        options: {
          isWholeLine: true,
          className: "line-highlight"
        }
      }
    ];
  }, [current?.line]);

  useEffect(() => {
    if (decorationsRef.current) {
      decorationsRef.current.set(decorations);
    }
  }, [decorations]);

  const explainCurrentLine = async () => {
    if (!selectedProblem || !editorRef.current) return;
    const position = editorRef.current.getPosition();
    const line = position.lineNumber;
    setLoading(true);
    try {
      const explanation = await explainWithAi({
        code: selectedProblem.code,
        line,
        language: selectedProblem.language,
        question: "Explain what this line does in the context of the algorithm."
      });
      setAiExplanation(explanation);
    } catch (error) {
      setAiExplanation("Error getting AI explanation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel flex h-full min-w-[360px] flex-col p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Debugger Workspace</p>
        <button 
          onClick={explainCurrentLine}
          disabled={loading}
          className="rounded-lg border border-white/10 px-2 py-1 text-xs text-cyan-300 hover:bg-white/5 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Explain this line"}
        </button>
      </div>

      <div className="mb-3 rounded-lg border border-white/10 bg-slate-950/70 p-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          className="w-full resize-none bg-transparent text-xs outline-none placeholder:text-slate-500"
          placeholder="Enter custom input"
        />
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => runMock(input)}
            className="rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-3 py-1.5 text-xs font-medium"
          >
            Run Test Case
          </button>
          <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300">
            <WandSparkles className="mr-1 inline h-3.5 w-3.5" />
            Estimate Complexity
          </button>
        </div>
      </div>

      <div className="grid flex-1 grid-rows-[1fr_auto_auto] gap-3">
        <div className="overflow-hidden rounded-xl border border-white/10">
          <Editor
            height="100%"
            language={selectedProblem?.language ?? "cpp"}
            value={selectedProblem?.code ?? "// Select a problem"}
            options={{
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontSize: 13,
              smoothScrolling: true,
              readOnly: false,
              padding: { top: 12 }
            }}
            theme="vs-dark"
            onMount={(editor, monaco) => {
              editorRef.current = editor;
              decorationsRef.current = editor.createDecorationsCollection(decorations);
              monaco.editor.defineTheme("striver-dark", {
                base: "vs-dark",
                inherit: true,
                rules: [],
                colors: { "editor.background": "#020617" }
              });
              monaco.editor.setTheme("striver-dark");
            }}
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950/70 p-2">
          <div className="mb-2 flex items-center gap-2">
            <button onClick={prevStep} className="icon-btn">
              <SkipBack className="h-4 w-4" />
            </button>
            <button onClick={() => setPlaying(!isPlaying)} className="icon-btn">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button onClick={nextStep} className="icon-btn">
              <SkipForward className="h-4 w-4" />
            </button>
            <div className="ml-auto w-36">
              <Slider.Root
                min={0.25}
                max={3}
                step={0.25}
                value={[speed]}
                onValueChange={(values) => setSpeed(values[0] ?? 1)}
                className="relative flex h-5 items-center"
              >
                <Slider.Track className="relative h-1 grow rounded-full bg-white/10">
                  <Slider.Range className="absolute h-full rounded-full bg-cyan-400" />
                </Slider.Track>
                <Slider.Thumb className="block h-3 w-3 rounded-full bg-cyan-300 shadow-md shadow-cyan-400/50" />
              </Slider.Root>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            {current ? `Line ${current.line}: ${current.action}` : "Run a test case to generate timeline"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(current?.variables ?? {}).map(([k, v]) => (
              <span key={k} className="rounded-md border border-white/10 bg-slate-900 px-2 py-1 text-xs">
                {k}: {String(v)}
              </span>
            ))}
          </div>
          {aiExplanation && (
            <div className="mt-2 rounded-lg border border-white/10 bg-slate-900/70 p-2">
              <p className="text-xs text-slate-400">AI Explanation:</p>
              <p className="text-xs text-slate-200">{aiExplanation}</p>
            </div>
          )}
        </div>

        <div className="h-44 overflow-hidden rounded-xl border border-white/10 bg-slate-950/70">
          <ReactFlow fitView nodes={nodes} edges={edges}>
            <Background />
            <MiniMap pannable zoomable />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </section>
  );
}
