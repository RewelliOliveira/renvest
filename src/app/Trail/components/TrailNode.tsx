import { Check, Lock, Trophy, Star } from "lucide-react";
import { cn } from "cn";
import { NodePopover } from "./NodePopover";
import type { TrailNodeItem } from "../types/types";

interface TrailNodeProps {
  node: TrailNodeItem;
  isSelected: boolean;
  onSelect: (node: TrailNodeItem) => void;
}

export function TrailNode({ node, isSelected, onSelect }: TrailNodeProps) {
  const isCompleted = node.status === "completed";
  const isCurrent = node.status === "current";
  const isLocked = node.status === "locked";
  const isExam = node.kind === "exam";
  const title = isExam ? "Teste final" : node.lesson.title;
  const color = node.module.color;

  return (
    <div
      id={isCurrent ? "trail-current-node" : undefined}
      data-node-key={node.key}
      className={cn("group relative flex flex-col items-center select-none scroll-mt-40", isSelected ? "z-40" : "z-10")}
      style={{ transform: `translateX(calc(${node.positionX}px * var(--trail-spread, 1)))` }}
    >
      {isCurrent && (
        <span
          className="absolute -top-2 lg:-top-3 w-22 h-22 sm:w-24 sm:h-24 lg:w-30 lg:h-30 rounded-full border-4 pointer-events-none"
          style={{ borderColor: `${color}66` }}
        />
      )}

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onSelect(node);
        }}
        aria-label={`${title} (${isCompleted ? "concluída" : isCurrent ? "disponível" : "bloqueada"})`}
        aria-expanded={isSelected}
        className={cn(
          "relative w-18 h-16 sm:w-20 sm:h-18 lg:w-24 lg:h-22 rounded-[50%] flex items-center justify-center cursor-pointer transition-all",
          "active:translate-y-1.5 lg:hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40",
          isLocked
            ? "bg-neutral-700 text-neutral-500 shadow-[0_6px_0_#262626] active:shadow-none"
            : "text-white active:shadow-none hover:brightness-110"
        )}
        style={
          isLocked
            ? undefined
            : { backgroundColor: color, boxShadow: `0 6px 0 color-mix(in srgb, ${color} 60%, black)` }
        }
      >
        {isExam ? (
          <Trophy className={cn("w-8 h-8 lg:w-10 lg:h-10", isLocked ? "text-neutral-500" : "text-white fill-white/30")} />
        ) : isCompleted ? (
          <Check className="w-8 h-8 lg:w-10 lg:h-10 stroke-4" />
        ) : isLocked ? (
          <Lock className="w-7 h-7 lg:w-9 lg:h-9" />
        ) : (
          <Star className="w-8 h-8 lg:w-10 lg:h-10 fill-white" />
        )}
      </button>

      {!isSelected && (
        <span className="hidden lg:block absolute bottom-full mb-3 px-3 py-1.5 rounded-lg bg-neutral-900/95 border border-white/10 text-xs font-bold text-white whitespace-nowrap shadow-lg pointer-events-none opacity-0 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0">
          {title}
        </span>
      )}

      {isSelected && <NodePopover node={node} offsetX={node.positionX} />}
    </div>
  );
}
