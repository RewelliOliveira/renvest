import { Flame, BookOpenCheck } from "lucide-react";
import { LogomarcaIcon } from "@/assets/icons";
import { cn } from "cn";
import type { TrailData } from "../types/types";

interface TrailHeaderProps {
  trail?: TrailData | null;
}

export function TrailHeader({ trail }: TrailHeaderProps) {
  const lit = trail?.streak.active_today ?? false;

  return (
    <header className="sticky top-0 z-40 w-full h-14 sm:h-15 bg-[#000815]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6">
      <div className="max-w-md h-full mx-auto flex items-center justify-between">
        <LogomarcaIcon className="h-6 sm:h-7 w-auto object-contain drop-shadow-[0_2px_8px_rgba(240,86,86,0.3)]" />

        {trail && (
          <div className="flex items-center gap-4 text-sm font-extrabold">
            <span className="flex items-center gap-1 text-sky-300" title="Lições concluídas">
              <BookOpenCheck className="w-5 h-5" />
              {trail.progress.completed_lessons}/{trail.progress.total_lessons}
            </span>
            <span
              className={cn("flex items-center gap-1", lit ? "text-amber-400" : "text-neutral-400")}
              title="Ofensiva: dias seguidos estudando"
            >
              <Flame className={cn("w-5 h-5", lit && "fill-amber-400/40")} />
              {trail.streak.current_days}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
