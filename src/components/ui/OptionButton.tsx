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
        "w-full py-3 sm:py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-between text-left shadow-lg cursor-pointer",
        "border-b-4 active:border-b-0 active:translate-y-0.5 focus-visible:outline-none",
        showSuccess
          ? "bg-emerald-500/20 border border-emerald-500/30 border-b-4 border-b-emerald-600 text-white shadow-emerald-500/10"
          : showError
          ? "bg-red/20 border border-red/30 border-b-4 border-b-red-dark text-white shadow-red/10"
          : isSelected
          ? "bg-option-selected border border-transparent border-b-4 border-b-option-selected-border text-option-selected-text shadow-[0_4px_18px_rgba(76,144,221,0.25)]"
          : "bg-option-dark border border-white/10 border-b-4 border-b-option-dark-border text-white hover:border-white/20 hover:brightness-105",
        hasAnswered && !isSelected && !showSuccess && "opacity-40 cursor-default",
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
