import { useEffect, useId } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onCancel}
          className="fixed inset-0 z-60 flex items-end lg:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:p-0"
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-[#0b1322] border border-white/10 p-5 lg:p-6 shadow-2xl text-white select-none"
          >
            <h2 id={titleId} className="text-lg font-extrabold">
              {title}
            </h2>
            <p id={descriptionId} className="text-sm text-neutral-300 mt-1.5 leading-relaxed">
              {description}
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <button
                type="button"
                autoFocus
                onClick={onCancel}
                className="w-full py-3 rounded-xl font-bold text-white bg-red border-b-4 border-red-dark active:border-b-0 active:translate-y-0.5 hover:brightness-105 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="w-full py-3 rounded-xl font-bold text-red-light text-sm border border-red/40 bg-red/10 hover:bg-red/20 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/60"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
