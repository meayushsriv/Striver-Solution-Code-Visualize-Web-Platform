import * as Dialog from "@radix-ui/react-dialog";
import { Command, Search } from "lucide-react";
import { useMemo } from "react";
import { useAppStore } from "../store/appStore";

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, problems, selectProblem } = useAppStore();

  const top = useMemo(() => problems.slice(0, 12), [problems]);

  return (
    <Dialog.Root open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-20 z-50 w-[min(720px,92vw)] -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl">
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Search problems, commands, topics..." />
            <Command className="h-4 w-4 text-slate-500" />
          </div>
          <div className="max-h-80 space-y-1 overflow-y-auto">
            {top.map((problem) => (
              <button
                key={problem.id}
                onClick={() => {
                  selectProblem(problem.id);
                  setCommandPaletteOpen(false);
                }}
                className="w-full rounded-lg border border-transparent px-3 py-2 text-left text-sm hover:border-white/10 hover:bg-white/5"
              >
                {problem.title}
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
