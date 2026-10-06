import { motion } from "motion/react";
import { Check, Lock, Star, Gift, Trophy, Play, Sparkles } from "lucide-react";
import { MascotPoint } from "@/assets/icons";
import { cn } from "cn";
import type { TrailNodeItem } from "../types";

interface TrailNodeProps {
  node: TrailNodeItem;
  isCurrent: boolean;
  onSelect: (node: TrailNodeItem) => void;
}

export function TrailNode({ node, isCurrent, onSelect }: TrailNodeProps) {
  const isCompleted = node.status === "completed";
  const isLocked = node.status === "locked";

  // Deslocamento horizontal para criar o caminho sinuoso (-1 a 1)
  const offsetX = node.positionX * 64; // pixels no mobile

  return (
    <div
      className="relative flex flex-col items-center my-3 sm:my-4 transition-transform select-none"
      style={{ transform: `translateX(${offsetX}px)` }}
    >
      {/* Mascote Rev flutuando ao lado do nó ATUAL com balão de incentivo */}
      {isCurrent && (
        <div
          className={cn(
            "absolute -top-12 z-30 pointer-events-none flex items-center gap-2",
            node.positionX >= 0
              ? "-left-28 sm:-left-32 flex-row-reverse"
              : "-right-28 sm:-right-32 flex-row"
          )}
        >
          {/* Balão de fala */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
            transition={{
              y: { repeat: Infinity, duration: 2.4, ease: "easeInOut" },
              duration: 0.3,
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white text-neutral-900 text-[11px] font-extrabold shadow-lg flex items-center gap-1 border border-neutral-200"
          >
            <span>Começar!</span>
            <Sparkles className="w-3 h-3 text-red shrink-0" />
          </motion.div>

          {/* Mascote */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="w-16 h-16 shrink-0 flex items-center justify-center drop-shadow-[0_8px_16px_rgba(240,86,86,0.35)]"
          >
            <MascotPoint className="h-full w-auto object-contain" />
          </motion.div>
        </div>
      )}

      {/* Halo de pulso quando é o nó atual */}
      {isCurrent && (
        <span className="absolute -inset-2.5 rounded-full bg-red/25 blur-md animate-ping pointer-events-none [animation-duration:2.5s]" />
      )}

      {/* Botão circular 3D do Nó */}
      <button
        type="button"
        onClick={() => onSelect(node)}
        className={cn(
          "relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all shadow-xl",
          "border-b-6 active:border-b-0 active:translate-y-1.5 focus-visible:outline-none",
          // Estilo CONCLUÍDO
          isCompleted &&
            "bg-emerald-500 border-emerald-400 border-b-emerald-700 text-white shadow-emerald-500/20 hover:brightness-110",
          // Estilo ATUAL (Em andamento)
          isCurrent &&
            "bg-red border-red-light border-b-red-dark text-white shadow-[0_6px_28px_rgba(240,86,86,0.5)] hover:brightness-110 ring-4 ring-white/20",
          // Estilo BLOQUEADO
          isLocked &&
            "bg-neutral-800/90 border-white/5 border-b-neutral-950 text-neutral-500 shadow-none hover:bg-neutral-800"
        )}
      >
        {/* Ícone principal conforme o tipo e status */}
        {node.type === "chest" ? (
          <Gift
            className={cn(
              "w-8 h-8",
              isCompleted
                ? "text-yellow-300 fill-yellow-400/40"
                : isCurrent
                ? "text-white animate-bounce"
                : "text-neutral-500"
            )}
          />
        ) : node.type === "boss" ? (
          <Trophy
            className={cn(
              "w-8 h-8",
              isCompleted
                ? "text-yellow-300 fill-yellow-400/40"
                : isCurrent
                ? "text-white animate-bounce"
                : "text-neutral-500"
            )}
          />
        ) : isCompleted ? (
          <Check className="w-8 h-8 stroke-[3.5] text-white" />
        ) : isCurrent ? (
          <Play className="w-8 h-8 fill-white text-white ml-0.5" />
        ) : (
          <Lock className="w-6 h-6 text-neutral-400" />
        )}

        {/* Estrelas conquistadas em nós concluídos */}
        {isCompleted && (
          <div className="absolute -bottom-2 flex items-center justify-center gap-0.5 px-1.5 py-0.5 rounded-full bg-neutral-900/90 border border-white/10 shadow-sm">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={cn(
                  "w-2.5 h-2.5",
                  (node.stars || 0) >= starIdx
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-neutral-600"
                )}
              />
            ))}
          </div>
        )}
      </button>

      {/* Título resumido abaixo do nó */}
      <div className="mt-2 text-center max-w-32">
        <span
          className={cn(
            "text-xs font-bold leading-tight block",
            isCurrent
              ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              : isCompleted
              ? "text-neutral-200"
              : "text-neutral-500"
          )}
        >
          {node.title}
        </span>
      </div>
    </div>
  );
}
