import { motion } from "framer-motion";

export function SciFiBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[var(--background-gradient)]" aria-hidden />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:84px_84px] opacity-40" />
      <motion.div
        className="absolute left-[6%] top-[8%] h-64 w-64 rounded-full bg-[var(--orb-one)] blur-3xl"
        animate={{ x: [0, 18, -10, 0], y: [0, -8, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[8%] top-[16%] h-72 w-72 rounded-full bg-[var(--orb-two)] blur-3xl"
        animate={{ x: [0, -20, 12, 0], y: [0, 20, -18, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[28%] h-80 w-80 rounded-full bg-[var(--orb-three)] blur-3xl"
        animate={{ x: [0, 24, -12, 0], y: [0, -18, 12, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
