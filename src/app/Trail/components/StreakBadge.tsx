import { motion } from "motion/react";
import { Flame } from "lucide-react";
import { cn } from "cn";
import type { Streak } from "../types/types";

interface StreakBadgeProps {
  streak: Streak;
  className?: string;
}

function streakHeadline({ current_days }: Streak): string {
  if (current_days === 0) return "Ofensiva";
  return `${current_days} ${current_days === 1 ? "dia" : "dias"}`;
}

function streakCaption({ current_days, active_today }: Streak): string {
  if (current_days === 0) return "comece hoje!";
  return active_today ? "de ofensiva" : "estude hoje para manter";
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
  const lit = streak.active_today;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
      transition={{ y: { repeat: Infinity, duration: 2.4, ease: "easeInOut" }, duration: 0.3 }}
      className={cn(
        "flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-xl border shadow-lg max-w-30",
        lit ? "bg-amber-500/15 border-amber-400/40" : "bg-neutral-900/90 border-white/15",
        className
      )}
      title="Ofensiva: dias seguidos com lições ou testes concluídos"
    >
      <Flame
        className={cn(
          "w-6 h-6 shrink-0",
          lit ? "text-amber-400 fill-amber-400/40 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" : "text-neutral-400"
        )}
      />
      <div className="flex flex-col leading-tight min-w-0">
        <span className={cn("text-sm font-extrabold whitespace-nowrap", lit ? "text-amber-200" : "text-white/85")}>
          {streakHeadline(streak)}
        </span>
        <span className={cn("text-[10px] font-semibold", lit ? "text-amber-200/80" : "text-white/55")}>
          {streakCaption(streak)}
        </span>
      </div>
    </motion.div>
  );
}
