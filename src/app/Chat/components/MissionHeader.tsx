import { ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { MissionMode } from "../types";

interface MissionHeaderProps {
  progressValue: number;
  mode: MissionMode;
  currentQuestionIndex: number;
  totalQuestions: number;
  onBack: () => void;
}

export function MissionHeader({
  progressValue,
  mode,
  currentQuestionIndex,
  totalQuestions,
  onBack,
}: MissionHeaderProps) {
  return (
    <header className="w-full flex items-center gap-3 pt-1 pb-3 shrink-0">
      <button
        type="button"
        onClick={onBack}
        aria-label="Voltar"
        className="text-white/80 hover:text-white transition-opacity p-1 -ml-1 cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <Progress value={progressValue} className="flex-1" />

      {mode === "quiz" && (
        <span className="text-xs font-semibold text-white/50 shrink-0">
          {currentQuestionIndex + 1}/{totalQuestions}
        </span>
      )}
    </header>
  );
}
