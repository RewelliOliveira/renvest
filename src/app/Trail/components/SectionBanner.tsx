import { BookOpen, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { TrailModule } from "../types/types";

interface SectionBannerProps {
  module: TrailModule;
  completedCount: number;
  totalCount: number;
}

export function SectionBanner({
  module,
  completedCount,
  totalCount,
}: SectionBannerProps) {
  const percent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="w-full max-w-md mx-auto my-4 px-4">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#071329] via-[#0b1b38] to-[#040c1c] border border-white/10 p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red/20 border border-red/30 text-red-light">
                Seção {module.sectionNumber}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-white/50">
                <Sparkles className="w-3 h-3 text-sky-400" />
                {percent}% concluído
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              {module.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300/80 mt-1 line-clamp-2">
              {module.description}
            </p>
          </div>

          <button
            type="button"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer shrink-0"
            title="Guia de estudos da seção"
          >
            <BookOpen className="w-5 h-5 text-sky-400" />
          </button>
        </div>

        <div className="mt-3.5 pt-1 relative z-10">
          <Progress value={percent} className="h-2.5 bg-neutral-900/90" />
          <div className="flex justify-between items-center text-[10px] text-white/50 mt-1 font-semibold">
            <span>
              {completedCount} de {totalCount} concluídos
            </span>
            <span>{totalCount - completedCount} restantes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
