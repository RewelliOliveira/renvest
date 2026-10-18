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
      className={cn("relative flex flex-col items-center select-none scroll-mt-40", isSelected ? "z-40" : "z-10")}
      style={{ transform: `translateX(${node.positionX}px)` }}
    >
      {isCurrent && (
        <span
          className="absolute -top-2 w-22 h-22 sm:w-24 sm:h-24 rounded-full border-4 pointer-events-none"
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
          "relative w-18 h-16 sm:w-20 sm:h-18 rounded-[50%] flex items-center justify-center cursor-pointer transition-all",
          "active:translate-y-1.5 focus-visible:outline-none",
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
          <Trophy className={cn("w-8 h-8", isLocked ? "text-neutral-500" : "text-white fill-white/30")} />
        ) : isCompleted ? (
          <Check className="w-8 h-8 stroke-4" />
        ) : isLocked ? (
          <Lock className="w-7 h-7" />
        ) : (
          <Star className="w-8 h-8 fill-white" />
        )}
      </button>

      {isSelected && <NodePopover node={node} offsetX={node.positionX} />}
    </div>
  );
}
