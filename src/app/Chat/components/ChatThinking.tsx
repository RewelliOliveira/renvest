import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MascotThinking } from "@/assets/icons";
import type { MascotVariant } from "@/assets/mascotPalettes";

const PHRASES = [
  "Pensando na sua pergunta…",
  "Consultando as fontes oficiais…",
  "Conferindo os números…",
  "Montando uma explicação simples…",
];

const PHRASE_INTERVAL_MS = 1800;

interface ChatThinkingProps {
  avatar: MascotVariant;
}

// Rev coçando a cabeça enquanto a resposta é gerada
export function ChatThinking({ avatar }: ChatThinkingProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setPhraseIndex((prev) => Math.min(prev + 1, PHRASES.length - 1)),
      PHRASE_INTERVAL_MS
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-end gap-1 self-start"
    >
      <MascotThinking variant={avatar} className="w-14 h-14 shrink-0 -ml-1" />
      <div className="mb-1 rounded-2xl rounded-bl-md bg-[#040a14] border-2 border-b-4 border-neutral-600/90 px-3.5 py-2 type-body-sm text-neutral-300">
        <AnimatePresence mode="wait">
          <motion.span
            key={phraseIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="block"
          >
            {PHRASES[phraseIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
