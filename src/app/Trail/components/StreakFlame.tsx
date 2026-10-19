import type { ReactNode } from "react";
import { motion } from "motion/react";

interface StreakFlameProps {
  lit: boolean;
  children: ReactNode;
}

export function StreakFlame({ lit, children }: StreakFlameProps) {
  if (!lit) return <span className="inline-flex">{children}</span>;

  return (
    <motion.span
      initial={{ scale: 0.4, rotate: -18 }}
      animate={{ scale: [1, 1.1, 1], rotate: 0 }}
      transition={{
        rotate: { type: "spring", stiffness: 260, damping: 12 },
        scale: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
      }}
      className="inline-flex origin-bottom"
    >
      {children}
    </motion.span>
  );
}
