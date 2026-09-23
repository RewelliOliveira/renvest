import { motion } from "motion/react";
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
      <motion.div
        className="h-full rounded-full bg-progress-dark"
        initial={false}
        animate={{ width: `${percentage}%` }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      />
    </div>
  );
}
