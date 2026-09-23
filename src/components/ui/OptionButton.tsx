import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "cn";

export interface OptionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean;
  isCorrect?: boolean;
  hasAnswered?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function OptionButton({
  isSelected = false,
  isCorrect,
  hasAnswered = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: OptionButtonProps) {
  const showSuccess = hasAnswered && isCorrect;
  const showError = hasAnswered && isSelected && !isCorrect;

  return (
    <button
      type="button"
      disabled={disabled || hasAnswered}
      className={cn(
        "w-full py-3.5 px-4 rounded-xl sm:rounded-2xl text-left text-sm sm:text-base font-semibold border-2 transition-all flex items-center justify-between cursor-pointer",
        "border-b-4 active:border-b-0 active:translate-y-0.5 shadow-md",
        showSuccess
          ? "bg-emerald-500/20 border-emerald-500 border-b-emerald-700 text-white shadow-emerald-500/10"
          : showError
          ? "bg-red/20 border-red border-b-red-dark text-white shadow-red/10"
          : isSelected
          ? "bg-option-selected border-option-selected-border border-b-option-selected-border text-option-selected-text font-bold"
          : "bg-option-dark border-white/10 border-b-option-dark-border text-white hover:border-white/20",
        hasAnswered && !isSelected && !showSuccess && "opacity-50 cursor-default",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate whitespace-normal leading-snug">{children}</span>
      </div>
    </button>
  );
}
