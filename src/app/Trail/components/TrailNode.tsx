import { motion } from "motion/react";
import { CheckIcon, LockSimpleIcon, FlagIcon, StarIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { NodePopover } from "./NodePopover";
import { Asteroid, Planet } from "./CelestialBody";
import type { TrailNodeItem } from "../types/types";

interface TrailNodeProps {
  node: TrailNodeItem;
  isSelected: boolean;
  justCompleted?: boolean;
  onSelect: (node: TrailNodeItem) => void;
}

export function TrailNode({ node, isSelected, justCompleted = false, onSelect }: TrailNodeProps) {
  const isCompleted = node.status === "completed";
  const isCurrent = node.status === "current";
  const isLocked = node.status === "locked";
  const isExam = node.kind === "exam";
  const title = isExam ? "Teste final" : node.lesson.title;
  const color = node.module.color;
  const variant = isExam ? 0 : node.lesson.order;
  const iconClass = isExam ? "w-10 h-10 lg:w-12 lg:h-12" : "w-8 h-8 lg:w-10 lg:h-10";

  const icon = isCompleted ? (
    <CheckIcon weight="bold" className={iconClass} />
  ) : isLocked ? (
    <LockSimpleIcon className={iconClass} />
  ) : isExam ? (
    <FlagIcon weight="fill" className={iconClass} />
  ) : (
    <StarIcon weight="fill" className={iconClass} />
  );

  return (
    <div
      id={isCurrent ? "trail-current-node" : undefined}
      data-node-key={node.key}
      className={cn("group relative flex flex-col items-center select-none scroll-mt-40", isSelected ? "z-20" : "z-10")}
      style={{ transform: `translateX(calc(${node.positionX}px * var(--trail-spread, 1)))` }}
    >
      {isCurrent && !isSelected && (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: [0, -5, 0] }}
          transition={{ opacity: { duration: 0.3 }, y: { repeat: Infinity, duration: 1.6, ease: "easeInOut" } }}
          className="absolute bottom-full mb-5 lg:mb-6 px-3 py-1.5 rounded-xl bg-white font-heading text-xs lg:text-sm font-extrabold uppercase tracking-wide whitespace-nowrap shadow-lg pointer-events-none"
          style={{ color }}
        >
          {isExam ? "Pousar" : "Começar"}
          <span className="absolute left-1/2 -bottom-1 w-2.5 h-2.5 -translate-x-1/2 rotate-45 bg-white" />
        </motion.span>
      )}

      <motion.div
        animate={isLocked ? undefined : { y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3 + (variant % 3) * 0.7, ease: "easeInOut" }}
        className={cn(
          "relative",
          isExam ? "w-28 h-28 lg:w-36 lg:h-36" : "w-18 h-18 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
        )}
      >
        {isCurrent && (
          <motion.span
            animate={{ scale: [1, 1.12, 1], opacity: [0.9, 0.35, 0.9] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute -inset-3 lg:-inset-4 rounded-full border-4 pointer-events-none"
            style={{ borderColor: `${color}88` }}
          />
        )}

        {justCompleted && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0.9 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 }}
            className="absolute inset-0 rounded-full border-4 pointer-events-none"
            style={{ borderColor: color }}
          />
        )}

        <button
          type="button"
          data-no-bounce
          onClick={(event) => {
            event.stopPropagation();
            onSelect(node);
          }}
          aria-label={`${title} (${isCompleted ? "concluída" : isCurrent ? "disponível" : "bloqueada"})`}
          aria-expanded={isSelected}
          className={cn(
            "relative w-full h-full flex items-center justify-center text-white cursor-pointer transition-all",
            "active:scale-95 lg:hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 rounded-full",
            !isLocked && "hover:brightness-110"
          )}
        >
          <motion.span
            initial={justCompleted ? { scale: 0, rotate: -45 } : false}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 12, delay: 0.25 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isExam ? (
              <Planet color={color} isLocked={isLocked} variant={node.module.order}>{icon}</Planet>
            ) : (
              <Asteroid color={color} isLocked={isLocked} variant={variant}>{icon}</Asteroid>
            )}
          </motion.span>
        </button>
      </motion.div>

      {!isSelected && !isCurrent && (
        <span className="hidden lg:block absolute bottom-full mb-3 px-3 py-1.5 rounded-lg bg-neutral-900/95 border border-white/10 font-heading text-xs font-bold text-white whitespace-nowrap shadow-lg pointer-events-none opacity-0 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0">
          {title}
        </span>
      )}

      {isSelected && <NodePopover node={node} offsetX={node.positionX} />}
    </div>
  );
}
