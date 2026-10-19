import { motion } from "motion/react";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "cn";
import type { TrailNodeItem } from "../types/types";

interface NodePopoverProps {
  node: TrailNodeItem;
  offsetX: number;
}

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function NodePopover({ node, offsetX }: NodePopoverProps) {
  const navigate = useNavigate();
  const isLocked = node.status === "locked";
  const isCompleted = node.status === "completed";
  const isExam = node.kind === "exam";

  // Lições mostram só o título e o botão; detalhes ficam apenas no teste final
  const title = isExam ? "Teste final" : isCompleted ? `Revisão: ${node.lesson.title}` : node.lesson.title;
  const subtitle = isExam
    ? `${node.exam.question_count} questões • mínimo de ${percent(node.exam.pass_score)}`
    : null;
  const description = !isExam
    ? null
    : isLocked
    ? node.module.status === "locked"
      ? `Passe no teste final do módulo anterior para desbloquear o Módulo ${node.module.order}.`
      : "Conclua todas as etapas acima para desbloquear."
    : node.exam.best_score !== null
    ? `Sua melhor nota: ${percent(node.exam.best_score)}.`
    : `Acerte pelo menos ${percent(node.exam.pass_score)} para concluir o módulo.`;
  const actionLabel = isExam
    ? isCompleted ? "Refazer teste" : node.exam.attempts > 0 ? "Tentar novamente" : "Começar teste"
    : isCompleted ? "Revisar lição" : "Começar";

  const color = isLocked ? undefined : node.module.color;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      className="absolute top-full left-1/2 mt-3 z-50 w-[min(18rem,calc(100vw-2rem))]"
      style={{ x: `calc(-50% - ${offsetX}px * var(--trail-spread, 1))` }}
      onClick={(event) => event.stopPropagation()}
    >
      <span
        className={cn("absolute -top-2 w-4 h-4 rotate-45 rounded-sm", isLocked && "bg-neutral-800 border-l border-t border-white/10")}
        style={{ left: `calc(50% + ${offsetX}px * var(--trail-spread, 1) - 0.5rem)`, backgroundColor: color }}
      />
      <div
        className={cn(
          "relative rounded-2xl p-4 shadow-2xl text-left",
          isLocked ? "bg-neutral-800 border border-white/10" : "text-white"
        )}
        style={{ backgroundColor: color }}
      >
        <h3 className={cn("text-base font-extrabold leading-snug", isLocked ? "text-neutral-300" : "text-white")}>{title}</h3>
        {subtitle && (
          <p className={cn("text-xs font-semibold mt-0.5", isLocked ? "text-neutral-500" : "text-white/80")}>{subtitle}</p>
        )}
        {description && (
          <p className={cn("text-xs leading-relaxed mt-2", isLocked ? "text-neutral-400" : "text-white/90")}>{description}</p>
        )}

        <button
          type="button"
          disabled={isLocked}
          onClick={() => navigate(isExam ? `/exam/${node.module.id}` : `/lesson/${node.lesson.id}`)}
          className={cn(
            "mt-3 w-full py-3 rounded-xl text-sm font-extrabold uppercase tracking-wide transition-all flex items-center justify-center gap-2",
            isLocked
              ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
              : "bg-white border-b-4 border-black/20 active:border-b-0 active:translate-y-0.5 cursor-pointer hover:brightness-95"
          )}
          style={isLocked ? undefined : { color: node.module.color }}
        >
          {isLocked && <Lock className="w-4 h-4" />}
          {isLocked ? "Bloqueado" : actionLabel}
        </button>
      </div>
    </motion.div>
  );
}
