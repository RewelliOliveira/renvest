import { motion } from "motion/react";
import { cn } from "cn";

export interface AnimatedCheckProps {
  className?: string;
}

export function AnimatedCheck({ className }: AnimatedCheckProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn("overflow-visible text-emerald-400", className)}>
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ scale: 1, opacity: 0.7 }}
        animate={{ scale: 1.9, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        style={{ transformOrigin: "center" }}
      />
      <motion.circle
        cx="12"
        cy="12"
        r="11"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 16 }}
        style={{ transformOrigin: "center" }}
      />
      <motion.path
        d="M7 12.5l3.2 3.2L17 8.8"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
      />
    </svg>
  );
}
