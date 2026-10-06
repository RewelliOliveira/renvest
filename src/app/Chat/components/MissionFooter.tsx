import { motion } from "motion/react";
import { cn } from "cn";
import { LearningChat } from "./LearningChat";
import type { MissionMode, LearningPhase } from "../types";

interface MissionFooterProps {
  mode: MissionMode;
  phase: LearningPhase;
  chatSuggestions: string[];
  isTyping: boolean;
  selectedId: string | null;
  hasAnswered: boolean;
  isLastQuestion: boolean;
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
          Estou pronto para o teste! 🚀
        </motion.button>
      )}

      {mode === "learning" && phase === "slides" && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onContinueLearning}
          className="w-full py-3.5 sm:py-4 rounded-xl font-bold text-white text-base bg-red border-b-4 border-red-dark active:border-b-0 active:translate-y-0.5 transition-all shadow-lg hover:brightness-105 focus-visible:outline-none cursor-pointer"
        >
          Continuar
        </motion.button>
      )}

      {mode === "quiz" && (
        <motion.button
          whileTap={{ scale: !selectedId ? 1 : 0.98 }}
          type="button"
          onClick={hasAnswered ? onContinueQuiz : onConfirmQuiz}
          disabled={!selectedId}
          className={cn(
            "w-full py-3.5 sm:py-4 rounded-xl font-bold text-white text-base transition-all shadow-lg focus-visible:outline-none",
            selectedId
              ? "bg-red border-b-4 border-red-dark active:border-b-0 active:translate-y-0.5 hover:brightness-105 cursor-pointer"
              : "bg-neutral-800 border-b-4 border-neutral-900 opacity-40 cursor-not-allowed"
          )}
        >
          {hasAnswered
            ? isLastQuestion
              ? "Concluir Missão 🎉"
              : "Continuar"
            : "Confirmar"}
        </motion.button>
      )}
    </footer>
  );
}
