import { ChartBarIcon, XCircleIcon } from "@phosphor-icons/react";
import { AnimatedCheck } from "@/components/ui/AnimatedCheck";
import { OptionButton } from "@/components/ui/OptionButton";
import type { QuizOption } from "../types/types";

interface QuizOptionsListProps {
  options: QuizOption[];
  selectedId: string | null;
  hasAnswered: boolean;
  onSelect: (id: string) => void;
}

export function QuizOptionsList({
  options,
  selectedId,
  hasAnswered,
  onSelect,
}: QuizOptionsListProps) {
  return (
    <div className="w-full flex flex-col gap-2.5 sm:gap-3">
      {options.map((option, index) => {
        const isSelected = selectedId === option.id;
        const showSuccess = hasAnswered && option.isCorrect;
        const showError = hasAnswered && isSelected && !option.isCorrect;

        return (
          <OptionButton
            key={option.id}
            isSelected={isSelected}
            isCorrect={option.isCorrect}
            hasAnswered={hasAnswered}
            shortcut={index + 1}
            onClick={() => onSelect(option.id)}
            icon={
              showSuccess ? (
                <AnimatedCheck className="w-5 h-5" />
              ) : showError ? (
                <XCircleIcon className="w-5 h-5 text-red" />
              ) : (
                <ChartBarIcon
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
    </div>
  );
}
