import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
const LOADER_DELAY_S = 0.3;

interface MascotLoaderProps {
  title?: string;
}

export function MascotLoader({ title = "Carregando" }: MascotLoaderProps) {
  const [avatar] = useAvatar();
  const [tipIndex, setTipIndex] = useState(() =>
    Math.floor(Math.random() * TIPS.length),
  );

  useEffect(() => {
    const timer = setInterval(
      () => setTipIndex((prev) => (prev + 1) % TIPS.length),
      TIP_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, delay: LOADER_DELAY_S }}
      className="fixed inset-0 lg:left-(--side-nav-width,0px) z-50 select-none bg-[#0b1220] text-white flex flex-col items-center justify-center px-8"
    >
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <div className="rev-loading relative h-36 w-40 flex flex-col items-center justify-end">
          <MascotHello
            variant={avatar}
            className="h-28 w-auto object-contain"
          />
          <span className="mt-1 h-1.5 w-24 rounded-full bg-white/10" />
        </div>

        <p className="mt-8 font-heading text-sm font-extrabold uppercase tracking-widest text-neutral-500">
          {title}...
        </p>

        <div className="mt-4 min-h-16 flex items-start justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="type-body text-white/85"
            >
              Dica: {TIPS[tipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
