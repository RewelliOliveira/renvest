import { ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { MissionMode } from "../types/types";

interface MissionHeaderProps {
  progressValue: number;
  mode: MissionMode;
  counterLabel: string;
  onBack: () => void;
}

export function MissionHeader({
  progressValue,
  mode,
  counterLabel,
  onBack,
}: MissionHeaderProps) {
  return (
    <header className="w-full flex items-center gap-3 pt-1 pb-3 shrink-0 lg:max-w-5xl lg:mx-auto lg:px-10 lg:pt-8 lg:pb-6 lg:gap-5">
      <button
        type="button"
        onClick={onBack}
        aria-label="Voltar"
        className="text-white/80 hover:text-white transition-opacity p-1 -ml-1 cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <Progress value={progressValue} className="flex-1" />

      {mode === "quiz" && counterLabel && (
        <span className="text-xs font-semibold text-white/50 shrink-0">
          {counterLabel}
        </span>
      )}
    </header>
  );
}
