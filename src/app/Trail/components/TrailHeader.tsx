import { Flame, Coins, Heart, Zap } from "lucide-react";
import { LogomarcaIcon } from "@/assets/icons";
import type { UserStats } from "../types";

interface TrailHeaderProps {
  stats: UserStats;
}

export function TrailHeader({ stats }: TrailHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#000815]/85 backdrop-blur-md border-b border-white/10 px-4 py-2.5 sm:px-6">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 shrink-0">
          <LogomarcaIcon className="h-6 sm:h-7 w-auto object-contain drop-shadow-[0_2px_8px_rgba(240,86,86,0.3)]" />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-bold shadow-sm"
            title="Dias seguidos praticando"
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30 animate-pulse shrink-0" />
            <span>{stats.streak}</span>
          </div>

          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs sm:text-sm font-bold shadow-sm"
            title="RenCoins acumuladas"
          >
            <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>{stats.coins}</span>
          </div>

          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue/15 border border-blue/30 text-sky-300 text-xs sm:text-sm font-bold shadow-sm"
            title="Total de XP"
          >
            <Zap className="w-4 h-4 text-[#38bdf8] fill-[#38bdf8]/40 shrink-0" />
            <span>{stats.xp}</span>
          </div>

          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-red/15 border border-red/30 text-red-light text-xs sm:text-sm font-bold shadow-sm"
            title="Vidas restantes"
          >
            <Heart className="w-4 h-4 text-red fill-red/40 shrink-0" />
            <span>{stats.hearts}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
