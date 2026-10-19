import { motion, AnimatePresence } from "motion/react";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import type { MascotVariant } from "@/assets/mascotPalettes";
import type { LearningPhase, MascotComponentType } from "../types/types";

interface LearningViewProps {
  slideIndex: number;
  phase: LearningPhase;
  bubbleText: string;
  isShowingReply: boolean;
  isTyping: boolean;
  MascotComponent: MascotComponentType;
  mascotVariant: MascotVariant;
}

export function LearningView({
  slideIndex,
  phase,
  bubbleText,
  isShowingReply,
  isTyping,
  MascotComponent,
  mascotVariant,
}: LearningViewProps) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center w-full my-auto min-h-0 py-2 lg:px-10 overflow-y-auto no-scrollbar">
      <AnimatePresence mode="wait">
        <motion.div
          key={`learn-${slideIndex}-${phase}-${isShowingReply}`}
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="w-full flex flex-col items-center justify-center lg:max-w-5xl lg:flex-row-reverse lg:gap-12"
        >
          {isTyping ? (
            <div className="w-full max-w-sm lg:max-w-xl lg:flex-1 rounded-2xl bg-[#040a14] border-2 border-neutral-600/90 px-5 py-4 flex items-center justify-center gap-1.5 shadow-2xl">
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
            </div>
          ) : (
            <SpeechBubble direction="auto">{bubbleText}</SpeechBubble>
          )}

          <div className="mt-4 sm:mt-6 lg:mt-0 flex items-center justify-center h-44 sm:h-52 lg:h-80 w-full lg:w-auto lg:shrink-0">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
              className="h-full flex items-center justify-center"
            >
              <MascotComponent variant={mascotVariant} className="h-full w-auto max-w-48 sm:max-w-55 lg:max-w-80 object-contain drop-shadow-[0_12px_32px_rgba(240,86,86,0.22)]" />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
