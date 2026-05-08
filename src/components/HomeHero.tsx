import { motion } from "framer-motion";

export function HomeHero({ total }: { total: number }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/20 via-slate-900 to-cyan-500/10 p-6 shadow-2xl shadow-indigo-950/40">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_top_right,rgba(34,211,238,0.35),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(129,140,248,0.35),transparent_40%)]" />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">AI Assisted Competitive Programming</p>
        <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
          Debug, visualize, and master your local <span className="text-indigo-300">Striver</span> solutions
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Search {total} indexed solutions, dry run custom input, and step through algorithm state with animations.
        </p>
      </motion.div>
    </section>
  );
}
