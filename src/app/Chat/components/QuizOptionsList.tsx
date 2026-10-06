import { BarChart2, CheckCircle2, XCircle, FileText } from "lucide-react";
import { motion } from "motion/react";
import { OptionButton } from "@/components/ui/OptionButton";
import type { QuizOption, SourceCitation } from "../types";

interface QuizOptionsListProps {
  options: QuizOption[];
  selectedId: string | null;
  hasAnswered: boolean;
  source: SourceCitation;
  onSelect: (id: string) => void;
}

export function QuizOptionsList({
  options,
  selectedId,
  hasAnswered,
  source,
  onSelect,
}: QuizOptionsListProps) {
  return (
    <div className="w-full flex flex-col gap-2.5 sm:gap-3">
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        const showSuccess = hasAnswered && option.isCorrect;
        const showError = hasAnswered && isSelected && !option.isCorrect;

        return (
          <OptionButton
            key={option.id}
            isSelected={isSelected}
            isCorrect={option.isCorrect}
            hasAnswered={hasAnswered}
            onClick={() => onSelect(option.id)}
            icon={
              showSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : showError ? (
                <XCircle className="w-5 h-5 text-red" />
              ) : (
                <BarChart2
                  className={
                    isSelected
                      ? "w-5 h-5 text-option-selected-text"
                      : "w-5 h-5 text-blue-400/80"
                  }
                />
              )
            }
          >
            {option.text}
          </OptionButton>
        );
      })}

      {hasAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 mt-1"
        >
          <FileText className="w-4 h-4 text-[#38bdf8] shrink-0" />
          <span>
            Fonte: <strong className="text-white">{source.document}</strong> —{" "}
            {source.section}
          </span>
        </motion.div>
      )}
    </div>
  );
}
