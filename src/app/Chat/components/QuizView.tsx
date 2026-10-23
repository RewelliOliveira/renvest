import { motion, AnimatePresence } from "motion/react";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { QuizOptionsList } from "./QuizOptionsList";
import type { MascotVariant } from "@/assets/mascotPalettes";
import type { MascotComponentType, QuizStep } from "../types/types";

interface QuizViewProps {
  attemptKey: number;
  isRetry: boolean;
  currentQuestion: QuizStep;
  selectedId: string | null;
  hasAnswered: boolean;
  MascotComponent: MascotComponentType;
  mascotVariant: MascotVariant;
  onSelectOption: (optionId: string) => void;
}

export function QuizView({
  attemptKey,
  isRetry,
  currentQuestion,
  selectedId,
  hasAnswered,
  MascotComponent,
  mascotVariant,
  onSelectOption,
}: QuizViewProps) {
  return (
    <main className="flex-1 flex flex-col justify-center w-full min-h-0 overflow-y-auto no-scrollbar py-2 lg:px-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={`quiz-${attemptKey}`}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="w-full flex flex-col gap-4 my-auto lg:max-w-3xl lg:mx-auto lg:gap-6"
        >
          <div className="w-full flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rev-wave w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 shrink-0 flex items-center justify-center"
            >
              <MascotComponent variant={mascotVariant} className="h-full w-auto object-contain drop-shadow-[0_8px_20px_rgba(240,86,86,0.25)]" />
            </motion.div>
            <div className="flex-1">
              <SpeechBubble direction="left">
                {hasAnswered
                  ? currentQuestion.explanation
                  : isRetry
                  ? "Essa você errou antes. Vamos tentar de novo?"
                  : "Vamos testar o que você aprendeu!"}
              </SpeechBubble>
            </div>
          </div>

          <div className="w-full pt-1">
            {isRetry && (
              <span className="inline-block mb-1.5 type-overline text-amber-400">
                Erro anterior
              </span>
            )}
            <h2 className="text-white type-question">
              {currentQuestion.question}
            </h2>
          </div>

          <QuizOptionsList
            options={currentQuestion.options}
            selectedId={selectedId}
            hasAnswered={hasAnswered}
            onSelect={onSelectOption}
          />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
