import { CheckCircleIcon, LockSimpleIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import type { TrailModule } from "../types/types";

interface SectionBannerProps {
  module: TrailModule;
  className?: string;
}

export function SectionBanner({ module, className }: SectionBannerProps) {
  const isLocked = module.status === "locked";
  const isCompleted = module.status === "completed";

  return (
    <div className={cn("w-full px-4 pt-2 pb-2 lg:pt-8 xl:pt-10", className)}>
      <div
        className={cn(
          "max-w-md lg:max-w-2xl mx-auto rounded-2xl px-4 py-3.5 lg:px-6 lg:py-5 shadow-lg flex items-center gap-3 lg:gap-5",
          isLocked ? "border" : "text-white"
        )}
        style={
          isLocked
            ? {
                backgroundColor: `color-mix(in srgb, ${module.color} 18%, #0b1220)`,
                borderColor: `color-mix(in srgb, ${module.color} 45%, transparent)`,
              }
            : { backgroundColor: module.color, boxShadow: `0 4px 0 color-mix(in srgb, ${module.color} 60%, black)` }
        }
      >
        <div className="flex-1 min-w-0">
          <span
            className={cn(
              "type-overline",
              isLocked ? "text-neutral-500" : "text-white/75"
            )}
          >
            Módulo {module.order}
          </span>
          <h2 className={cn("type-h2", isLocked ? "text-neutral-300" : "text-white")}>
            {module.title}
          </h2>
          <p className={cn("type-body-sm mt-0.5 lg:mt-1 truncate", isLocked ? "text-neutral-500" : "text-white/80")}>
            {module.subtitle}
          </p>
        </div>

        {(isLocked || isCompleted) && (
          <div
            className={cn(
              "shrink-0 flex items-center justify-center w-14 h-14 rounded-xl",
              isLocked ? "bg-white/5 text-neutral-500" : "bg-black/15 text-white"
            )}
          >
            {isLocked ? <LockSimpleIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-6 h-6" />}
          </div>
        )}
      </div>
    </div>
  );
}
