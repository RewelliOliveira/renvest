import { motion } from "motion/react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "cn";
import { ImmersiveFooter } from "@/components/layout/ImmersiveFooter";
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
  const showFeedback = mode === "quiz" && hasAnswered;

  const aside =
    mode === "learning" ? (
      <LearningChat
        suggestions={chatSuggestions}
        onSend={onChatMessage}
        disabled={isTyping}
      />
    ) : showFeedback ? (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        role="status"
        className={cn(
          "w-full rounded-2xl px-4 py-3 border flex items-start gap-3 lg:bg-transparent lg:border-0 lg:p-0 lg:items-center lg:gap-4",
          isCorrectAnswer ? "bg-emerald-500/15 border-emerald-500/30" : "bg-red/15 border-red/30"
        )}
      >
        {isCorrectAnswer ? (
          <CheckCircle2 className="w-6 h-6 lg:w-12 lg:h-12 text-emerald-400 shrink-0" />
        ) : (
          <XCircle className="w-6 h-6 lg:w-12 lg:h-12 text-red shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm lg:text-xl font-extrabold", isCorrectAnswer ? "text-emerald-300" : "text-red-light")}>
            {isCorrectAnswer ? "Muito bem!" : "Resposta correta:"}
          </p>
          <p className="text-xs lg:text-sm text-white/80 mt-0.5">
            {isCorrectAnswer ? "Você acertou essa questão." : correctOptionText}
          </p>
          {!isCorrectAnswer && (
            <p className="text-[11px] lg:text-xs text-white/55 mt-1">Essa questão volta no final da lição.</p>
          )}
        </div>
      </motion.div>
    ) : null;

  return (
    <ImmersiveFooter tone={showFeedback ? (isCorrectAnswer ? "success" : "error") : null} aside={aside}>
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
    </ImmersiveFooter>
  );
}
