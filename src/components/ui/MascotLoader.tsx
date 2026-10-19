import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music2 } from "lucide-react";
import { MascotHello } from "@/assets/icons";
import { useAvatar } from "@/lib/avatar";

const TIPS = [
  "Reserva de emergência vem antes de qualquer investimento.",
  "O FGC protege até R$ 250 mil por CPF em cada instituição.",
  "Estude um pouco todo dia para manter sua ofensiva acesa.",
  "Juros compostos trabalham a seu favor quando você começa cedo.",
  "Diversificar é não colocar todos os ovos na mesma cesta.",
  "Rentabilidade alta demais costuma vir com risco alto também.",
  "A CVM fiscaliza o mercado de valores mobiliários no Brasil.",
  "Na dúvida sobre algum conceito, pergunte ao Rev no chat.",
];

const TIP_INTERVAL_MS = 4000;
const DANCE = { repeat: Infinity, duration: 1.2, ease: "easeInOut" } as const;

interface MascotLoaderProps {
  title?: string;
}

export function MascotLoader({ title = "Carregando" }: MascotLoaderProps) {
  const [avatar] = useAvatar();
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));

  useEffect(() => {
    const timer = setInterval(() => setTipIndex((prev) => (prev + 1) % TIPS.length), TIP_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 select-none bg-[#0b1220] text-white flex flex-col items-center justify-center px-8"
    >
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <div className="relative h-36 w-40 flex flex-col items-center justify-end">
          <motion.div
            animate={{ y: [0, -8, 0], opacity: [0, 1, 0], rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            className="absolute top-0 right-1 text-sky-400/80"
          >
            <Music2 className="w-6 h-6" />
          </motion.div>

          <motion.div
            animate={{ rotate: [-7, 7, -7], y: [0, -5, 0, -5, 0] }}
            transition={DANCE}
            style={{ transformOrigin: "50% 100%" }}
            className="h-28 flex items-end justify-center"
          >
            <MascotHello variant={avatar} className="h-full w-auto object-contain" />
          </motion.div>

          <motion.span
            animate={{ scaleX: [1, 0.85, 1, 0.85, 1] }}
            transition={DANCE}
            className="mt-1 h-1.5 w-24 rounded-full bg-white/10"
          />
        </div>

        <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.15em] text-neutral-500">{title}...</p>

        <div className="mt-4 min-h-16 flex items-start justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-white/85 leading-relaxed"
            >
              Dica: {TIPS[tipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
