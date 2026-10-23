import { useEffect, useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { MascotHello } from "@/assets/icons";
import { MASCOT_PALETTES, type MascotVariant } from "@/assets/mascotPalettes";

const AVATAR_OPTIONS: Array<{ variant: MascotVariant; label: string }> = [
  { variant: "red", label: "Rubi" },
  { variant: "blue", label: "Safira" },
  { variant: "green", label: "Esmeralda" },
  { variant: "purple", label: "Ametista" },
  { variant: "amber", label: "Âmbar" },
];

function avatarLabel(variant: MascotVariant): string {
  return AVATAR_OPTIONS.find((option) => option.variant === variant)?.label ?? "";
}

interface AvatarPickerProps {
  open: boolean;
  selected: MascotVariant;
  onSave: (variant: MascotVariant) => void;
  onClose: () => void;
}

export function AvatarPicker({ open, selected, onSave, onClose }: AvatarPickerProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 z-60 flex items-end lg:items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <AvatarSheet selected={selected} onSave={onSave} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AvatarSheet({ selected, onSave, onClose }: Omit<AvatarPickerProps, "open">) {
  const titleId = useId();
  const [draft, setDraft] = useState(selected);
  const palette = MASCOT_PALETTES[draft];

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 380, damping: 34 }}
      onClick={(event) => event.stopPropagation()}
      className="w-full max-w-md rounded-t-3xl lg:rounded-3xl bg-[#0b1322] border border-white/10 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] lg:p-6 shadow-2xl text-white select-none"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 id={titleId} className="type-h3">
          Escolha a cor do seu Rev
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="p-1.5 -mr-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 cursor-pointer"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      <div
        className="relative rounded-2xl h-44 flex items-end justify-center overflow-hidden transition-colors duration-300"
        style={{ backgroundColor: palette.deep, boxShadow: `0 4px 0 ${palette.dark}` }}
      >
        <span className="absolute top-3 left-4 type-overline text-white/80">Rev {avatarLabel(draft)}</span>
        <motion.div
          key={draft}
          initial={{ y: 24, scale: 0.85 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 14 }}
          className="rev-wave h-36 -mb-1"
        >
          <MascotHello variant={draft} className="h-full w-auto object-contain" />
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-5 gap-3" role="radiogroup" aria-label="Cores do Rev">
        {AVATAR_OPTIONS.map(({ variant, label }) => {
          const isSelected = variant === draft;
          const swatch = MASCOT_PALETTES[variant];
          return (
            <div key={variant} className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`Rev ${label}`}
                autoFocus={isSelected}
                onClick={() => setDraft(variant)}
                className={cn(
                  "press-3d w-full aspect-square max-w-14 rounded-full border-b-4 flex items-center justify-center cursor-pointer transition-shadow",
                  isSelected && "ring-3 ring-white ring-offset-3 ring-offset-[#0b1322]"
                )}
                style={{ backgroundColor: swatch.base, borderBottomColor: swatch.dark }}
              >
                {isSelected && <CheckIcon weight="bold" className="w-5 h-5 text-white" />}
              </button>
              <span className={cn("type-micro", isSelected ? "text-white" : "text-neutral-500")}>{label}</span>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="press-3d mt-6 w-full py-3 rounded-xl type-button text-white border-b-4 hover:brightness-105 transition-[filter,background-color] cursor-pointer"
        style={{ backgroundColor: palette.deep, borderBottomColor: palette.dark }}
      >
        Pronto!
      </button>
    </motion.div>
  );
}
