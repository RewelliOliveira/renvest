import type { ComponentType, SVGProps } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { QuizOptionsList } from "./QuizOptionsList";
import type { QuizStep } from "../types/types";

interface QuizViewProps {
  quizIndex: number;
  currentQuestion: QuizStep;
  selectedId: string | null;
  hasAnswered: boolean;
  MascotComponent: ComponentType<SVGProps<SVGSVGElement>>;
  onSelectOption: (optionId: string) => void;
}

export function QuizView({
  quizIndex,
  currentQuestion,
  selectedId,
  hasAnswered,
  MascotComponent,
  onSelectOption,
}: QuizViewProps) {
  return (
    <main className="flex-1 flex flex-col justify-center w-full min-h-0 overflow-y-auto no-scrollbar py-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={`quiz-${quizIndex}`}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="w-full flex flex-col gap-4 my-auto"
        >
          <div className="w-full flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center"
            >
              <MascotComponent className="h-full w-auto object-contain drop-shadow-[0_8px_20px_rgba(240,86,86,0.25)]" />
            </motion.div>
            <div className="flex-1">
              <SpeechBubble direction="left">
                {hasAnswered
                  ? currentQuestion.explanation
                  : "Vamos testar o que você aprendeu sobre o FGC!"}
              </SpeechBubble>
            </div>
          </div>

          <div className="w-full pt-1">
            <h2 className="text-white text-base sm:text-lg font-bold leading-snug">
              {currentQuestion.question}
            </h2>
          </div>

          <QuizOptionsList
            options={currentQuestion.options}
            selectedId={selectedId}
            hasAnswered={hasAnswered}
            source={currentQuestion.source}
            onSelect={onSelectOption}
          />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
