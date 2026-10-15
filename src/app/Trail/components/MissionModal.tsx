import { motion, AnimatePresence } from "motion/react";
import { X, Zap, Coins, Star, Gift, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MascotHello } from "@/assets/icons";
import { cn } from "cn";
import type { TrailNodeItem } from "../types/types";

interface MissionModalProps {
  node: TrailNodeItem | null;
  onClose: () => void;
  onOpenChest?: (nodeId: string) => void;
}

export function MissionModal({ node, onClose, onOpenChest }: MissionModalProps) {
  const navigate = useNavigate();

  if (!node) return null;

  const isCompleted = node.status === "completed";
  const isCurrent = node.status === "current";
  const isLocked = node.status === "locked";
  const isChest = node.type === "chest";

  const handleStartMission = () => {
    onClose();
    if (node.route) {
      navigate(node.route);
    } else {
      navigate("/mission");
    }
  };

  const handleClaimChest = () => {
    if (onOpenChest) {
      onOpenChest(node.id);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative z-10 w-full max-w-sm sm:max-w-md bg-[#040a14] border border-white/10 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-red/15 rounded-full blur-2xl pointer-events-none" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center drop-shadow-[0_8px_16px_rgba(240,86,86,0.3)]">
              {isChest ? (
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Gift className="w-8 h-8 fill-amber-400/20" />
                </div>
              ) : (
                <MascotHello className="h-full w-auto object-contain" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                {isCompleted ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Concluída
                  </span>
                ) : isCurrent ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-red-light bg-red/10 border border-red/20 px-2 py-0.5 rounded-full">
                    <Zap className="w-3 h-3" />
                    Disponível Agora
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" />
                    Bloqueada
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                {node.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">{node.subtitle}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
            {node.description || "Participe desta lição prática com o Rev para acumular pontos e dominar os conceitos financeiros!"}
          </div>

          <div className="mb-5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50 block mb-2">
              Recompensas desta etapa
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                <Zap className="w-4 h-4 text-sky-400 mb-1" />
                <span className="text-xs font-bold text-white">+{node.xpReward} XP</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                <Coins className="w-4 h-4 text-yellow-400 mb-1" />
                <span className="text-xs font-bold text-white">+{node.coinReward}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                <Star className="w-4 h-4 text-amber-400 mb-1" />
                <span className="text-xs font-bold text-white">
                  {isCompleted ? "3 Estrelas" : "Até 3 ★"}
                </span>
              </div>
            </div>
          </div>

          {isChest ? (
            <button
              type="button"
              disabled={isLocked}
              onClick={handleClaimChest}
              className={cn(
                "w-full py-3.5 sm:py-4 rounded-xl font-bold text-white text-base transition-all shadow-lg flex items-center justify-center gap-2",
                !isLocked
                  ? "bg-amber-500 border-b-4 border-amber-700 active:border-b-0 active:translate-y-0.5 hover:brightness-105 cursor-pointer"
                  : "bg-neutral-800 border-b-4 border-neutral-900 opacity-50 cursor-not-allowed"
              )}
            >
              <Gift className="w-5 h-5" />
              <span>{isLocked ? "Baú Bloqueado" : "Resgatar Recompensa"}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isLocked}
              onClick={handleStartMission}
              className={cn(
                "w-full py-3.5 sm:py-4 rounded-xl font-bold text-white text-base transition-all shadow-lg flex items-center justify-center gap-2",
                !isLocked
                  ? "bg-red border-b-4 border-red-dark active:border-b-0 active:translate-y-0.5 hover:brightness-105 cursor-pointer"
                  : "bg-neutral-800 border-b-4 border-neutral-900 opacity-50 cursor-not-allowed"
              )}
            >
              {isLocked ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Conclua as etapas anteriores</span>
                </>
              ) : isCompleted ? (
                <>
                  <span>Praticar Novamente</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Começar Missão</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
