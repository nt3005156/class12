import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TIPS = [
  "Stuck on normalization? List functional dependencies first, then remove partial and transitive ones.",
  "For networking essays: draw a tiny diagram (client → router → ISP → server) before writing.",
  "OOP oral tip: say *why* composition helps when inheritance trees get deep.",
  "C pointers: read from right-to-left — `int *p` is *pointer to int*.",
  "Agile vs waterfall: connect each to *when requirements are stable vs shifting*.",
];

export function StudyCopilot() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  const nextTip = () => setI((v) => (v + 1) % TIPS.length);

  return (
    <>
      <motion.button
        type="button"
        layout
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-xl text-[var(--accent-strong)] shadow-[var(--shadow-soft)] backdrop-blur-md sm:bottom-8 sm:right-8"
        aria-label="Open study copilot"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
      >
        ✦
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="copilot-title"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 28, opacity: 0 }}
              className="app-panel w-full max-w-md rounded-2xl p-5 shadow-[var(--shadow-soft)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2
                  id="copilot-title"
                  className="font-display text-sm tracking-widest text-[var(--accent-strong)]"
                >
                  STUDY COPILOT
                </h2>
                <button
                  type="button"
                  className="app-icon-button px-2 py-1 text-xs"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                Offline tips — not a live AI model
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text)]">{TIPS[i]}</p>
              <button
                type="button"
                onClick={nextTip}
                className="button-primary mt-4 w-full justify-center"
              >
                Another tip
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
