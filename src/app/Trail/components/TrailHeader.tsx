import { Flame } from "lucide-react";
import { LogomarcaIcon } from "@/assets/icons";
import { cn } from "cn";
import { StreakFlame } from "./StreakFlame";
import type { TrailData } from "../types/types";

interface TrailHeaderProps {
  trail?: TrailData | null;
}

export function TrailHeader({ trail }: TrailHeaderProps) {
  const lit = trail?.streak.active_today ?? false;
  const days = trail?.streak.current_days ?? 0;

  return (
    <header className="sticky lg:static top-0 z-40 w-full h-14 sm:h-15 bg-[#000815]/90 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border-b border-white/10 lg:border-0 px-4 sm:px-6 lg:pt-4 xl:hidden">
      <div className="max-w-md lg:max-w-2xl h-full mx-auto flex items-center justify-between lg:justify-end">
        <LogomarcaIcon className="lg:hidden h-6 sm:h-7 w-auto object-contain drop-shadow-[0_2px_8px_rgba(240,86,86,0.3)]" />

        {trail && (
          <div className="flex items-center gap-5 font-heading text-base font-extrabold tabular-nums">
            <span
              className={cn("flex items-center gap-1.5", lit ? "text-amber-400" : "text-neutral-500")}
              title={
                lit
                  ? `Ofensiva de ${days} ${days === 1 ? "dia" : "dias"}`
                  : "Ofensiva: conclua uma lição hoje para mantê-la"
              }
              aria-label={`Ofensiva: ${days} ${days === 1 ? "dia" : "dias"}`}
            >
              <StreakFlame lit={lit}>
                <Flame
                  className={cn(
                    "w-6 h-6",
                    lit && "fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                  )}
                />
              </StreakFlame>
              {days}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
