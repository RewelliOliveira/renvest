import { LockSimpleIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { moduleProgress } from "../utils/progress";
import type { TrailModule } from "../types/types";

export function ModuleProgressList({ modules }: { modules: TrailModule[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {modules.map((module) => {
        const isLocked = module.status === "locked";
        const progress = moduleProgress(module);
        return (
          <li key={module.id}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className={cn("type-caption font-bold truncate", isLocked ? "text-neutral-500" : "text-white")}>
                {module.order}. {module.title}
              </span>
              {isLocked ? (
                <LockSimpleIcon className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              ) : (
                <span className="type-caption tabular-nums text-neutral-400 shrink-0">
                  {Math.round(progress * 100)}%
                </span>
              )}
            </div>
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{ width: `${progress * 100}%`, backgroundColor: module.color }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
