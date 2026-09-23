import { cn } from "cn";

export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressBar({ currentStep, totalSteps, className }: ProgressBarProps) {
  const percentage = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      className={cn(
        "relative h-4 sm:h-5 w-full rounded-full overflow-hidden bg-progress-light",
        className
      )}
    >
      <div
        className="h-full rounded-full bg-progress-dark transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
