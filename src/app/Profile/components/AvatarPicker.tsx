import { Check } from "lucide-react";
import { cn } from "cn";
import { MascotHello } from "@/assets/icons";
import type { MascotVariant } from "@/assets/mascotPalettes";

const AVATAR_OPTIONS: Array<{ variant: MascotVariant; label: string }> = [
  { variant: "red", label: "Rev Vermelho" },
  { variant: "blue", label: "Rev Azul" },
  { variant: "green", label: "Rev Verde" },
  { variant: "purple", label: "Rev Roxo" },
  { variant: "amber", label: "Rev Dourado" },
];

interface AvatarPickerProps {
  selected: MascotVariant;
  onSelect: (variant: MascotVariant) => void;
}

export function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="rounded-2xl bg-[#071329]/80 border border-white/10 p-4 shadow-lg">
      <p className="text-xs font-bold text-neutral-300 mb-3">Escolha seu avatar</p>
      <div className="grid grid-cols-5 gap-2">
        {AVATAR_OPTIONS.map(({ variant, label }) => {
          const isSelected = variant === selected;
          return (
            <button
              key={variant}
              type="button"
              onClick={() => onSelect(variant)}
              aria-label={label}
              aria-pressed={isSelected}
              title={label}
              className={cn(
                "relative aspect-square rounded-xl p-1.5 flex items-center justify-center border-2 transition-all cursor-pointer",
                isSelected ? "border-red bg-red/10 scale-105" : "border-white/10 bg-white/5 hover:border-white/30"
              )}
            >
              <MascotHello variant={variant} className="h-full w-auto object-contain" />
              {isSelected && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-3 text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
