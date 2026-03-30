import { motion } from "framer-motion";

export function SearchBar({ value, onChange, placeholder }) {
  return (
    <motion.div
      layout
      className="app-panel relative flex items-center gap-3 rounded-2xl px-4 py-3"
    >
      <span className="text-[var(--accent-strong)]" aria-hidden>
        ⌕
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-[var(--text-strong)] outline-none placeholder:text-[var(--muted)] sm:text-base"
        type="search"
        autoComplete="off"
        spellCheck={false}
      />
    </motion.div>
  );
}
