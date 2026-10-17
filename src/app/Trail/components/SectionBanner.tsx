import { CheckCircle2, Lock } from "lucide-react";
import { cn } from "cn";
import type { TrailModule } from "../types/types";

interface SectionBannerProps {
  module: TrailModule;
}

export function SectionBanner({ module }: SectionBannerProps) {
  const isLocked = module.status === "locked";
  const isCompleted = module.status === "completed";
  const completedLessons = module.lessons.filter((lesson) => lesson.status === "completed").length;

  return (
    <div className="sticky top-14 sm:top-15 z-30 w-[calc(100%+2rem)] -mx-4 px-4 pt-2 pb-2 bg-[#000815]/90 backdrop-blur-md">
      <div
        className={cn(
          "max-w-md mx-auto rounded-2xl px-4 py-3.5 shadow-lg flex items-center gap-3",
          isLocked ? "bg-neutral-800 border border-white/10" : "text-white"
        )}
        style={
          isLocked
            ? undefined
            : { backgroundColor: module.color, boxShadow: `0 4px 0 color-mix(in srgb, ${module.color} 60%, black)` }
        }
      >
        <div className="flex-1 min-w-0">
          <span
            className={cn(
              "text-[11px] font-extrabold uppercase tracking-widest",
              isLocked ? "text-neutral-500" : "text-white/75"
            )}
          >
            Módulo {module.order}
          </span>
          <h2 className={cn("text-lg font-extrabold leading-tight", isLocked ? "text-neutral-300" : "text-white")}>
            {module.title}
          </h2>
          <p className={cn("text-xs mt-0.5 truncate", isLocked ? "text-neutral-500" : "text-white/80")}>
            {module.subtitle}
          </p>
        </div>

        <div
          className={cn(
            "shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl text-[11px] font-bold",
            isLocked ? "bg-white/5 text-neutral-500" : "bg-black/15 text-white"
          )}
        >
          {isLocked ? (
            <Lock className="w-5 h-5" />
          ) : isCompleted ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <>
              <span className="text-base font-extrabold leading-none">
                {completedLessons}/{module.lessons.length}
              </span>
              <span className="text-[10px] opacity-80 mt-0.5">lições</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
