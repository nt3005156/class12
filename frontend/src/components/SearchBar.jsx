import { motion } from "framer-motion";

export function SearchBar({ value, onChange, placeholder }) {
  return (
    <motion.div
      layout
      className="glass-panel neon-border relative flex items-center gap-3 rounded-2xl px-4 py-3"
    >
      <span className="text-cyan-300/80" aria-hidden>
        ⌕
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500 sm:text-base"
        type="search"
        autoComplete="off"
        spellCheck={false}
      />
    </motion.div>
  );
}
