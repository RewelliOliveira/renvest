import { motion } from "motion/react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "cn";
import { LearningChat } from "./LearningChat";
import type { MissionMode, LearningPhase } from "../types/types";

interface MissionFooterProps {
  mode: MissionMode;
  phase: LearningPhase;
  chatSuggestions: string[];
  isTyping: boolean;
  selectedId: string | null;
  hasAnswered: boolean;
  isLastQuestion: boolean;
  isCorrectAnswer?: boolean;
  correctOptionText?: string;
  isFinishing?: boolean;
  onChatMessage: (text: string) => void;
  onStartQuiz: () => void;
  onContinueLearning: () => void;
  onConfirmQuiz: () => void;
  onContinueQuiz: () => void;
}

export function MissionFooter({
  mode,
  phase,
  chatSuggestions,
  isTyping,
  selectedId,
  hasAnswered,
  isLastQuestion,
  isCorrectAnswer = false,
  correctOptionText = "",
  isFinishing = false,
  onChatMessage,
  onStartQuiz,
  onContinueLearning,
  onConfirmQuiz,
  onContinueQuiz,
}: MissionFooterProps) {
  return (
    <footer className="w-full pt-2 pb-1 flex flex-col gap-2.5 shrink-0">
      {mode === "learning" && (
        <LearningChat
          suggestions={chatSuggestions}
          onSend={onChatMessage}
          disabled={isTyping}
        />
      )}

      {mode === "learning" && phase === "free-chat" && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onStartQuiz}
          className="w-full py-3.5 sm:py-4 rounded-xl font-bold text-white text-base bg-red border-b-4 border-red-dark active:border-b-0 active:translate-y-0.5 transition-all shadow-lg hover:brightness-105 focus-visible:outline-none cursor-pointer"
        >
          Estou pronto para o teste
        </motion.button>
      )}

      {mode === "learning" && phase === "slides" && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onContinueLearning}
          disabled={isTyping}
          className="w-full py-3.5 sm:py-4 rounded-xl font-bold text-white text-base bg-red border-b-4 border-red-dark active:border-b-0 active:translate-y-0.5 transition-all shadow-lg hover:brightness-105 focus-visible:outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continuar
        </motion.button>
      )}

      {mode === "quiz" && hasAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          className={cn(
            "w-full rounded-2xl px-4 py-3 border flex items-start gap-3",
            isCorrectAnswer ? "bg-emerald-500/15 border-emerald-500/30" : "bg-red/15 border-red/30"
          )}
        >
          {isCorrectAnswer ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-red shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className={cn("text-sm font-extrabold", isCorrectAnswer ? "text-emerald-300" : "text-red-light")}>
              {isCorrectAnswer ? "Muito bem!" : "Resposta correta:"}
            </p>
            <p className="text-xs text-white/80 mt-0.5">
              {isCorrectAnswer ? "Você acertou essa questão." : correctOptionText}
            </p>
            {!isCorrectAnswer && (
              <p className="text-[11px] text-white/55 mt-1">Essa questão volta no final da lição.</p>
            )}
          </div>
        </motion.div>
      )}

      {mode === "quiz" && (
        <motion.button
          whileTap={{ scale: !selectedId ? 1 : 0.98 }}
          type="button"
          onClick={hasAnswered ? onContinueQuiz : onConfirmQuiz}
          disabled={!selectedId || isFinishing}
          className={cn(
            "w-full py-3.5 sm:py-4 rounded-xl font-bold text-white text-base transition-all shadow-lg focus-visible:outline-none",
            hasAnswered && isCorrectAnswer
              ? "bg-emerald-500 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-0.5 hover:brightness-105 cursor-pointer"
              : selectedId
              ? "bg-red border-b-4 border-red-dark active:border-b-0 active:translate-y-0.5 hover:brightness-105 cursor-pointer"
              : "bg-neutral-800 border-b-4 border-neutral-900 opacity-40 cursor-not-allowed"
          )}
        >
          {hasAnswered
            ? isLastQuestion
              ? isFinishing
                ? "Salvando..."
                : "Concluir lição"
              : "Continuar"
            : "Confirmar"}
        </motion.button>
      )}
    </footer>
  );
}
