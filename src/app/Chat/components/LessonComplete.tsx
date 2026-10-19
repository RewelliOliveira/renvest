import { motion } from "motion/react";
import { Flame, Target } from "lucide-react";
import { cn } from "cn";
import { MascotHello } from "@/assets/icons";
import type { MascotVariant } from "@/assets/mascotPalettes";
import { Confetti } from "@/components/ui/Confetti";
import { ImmersiveFooter } from "@/components/layout/ImmersiveFooter";
import { StreakFlame } from "@/app/Trail/components/StreakFlame";
import type { Streak } from "@/app/Trail/types/types";

interface LessonCompleteProps {
  lessonTitle: string;
  firstTryCorrect: number;
  total: number;
  streak: Streak;
  mascotVariant: MascotVariant;
  onContinue: () => void;
}

export function LessonComplete({
  lessonTitle,
  firstTryCorrect,
  total,
  streak,
  mascotVariant,
  onContinue,
}: LessonCompleteProps) {
  const days = streak.current_days;
  const isPerfect = firstTryCorrect === total;

  return (
    <>
      <Confetti />

      <main className="flex-1 min-h-0 w-full flex flex-col items-center justify-center text-center gap-5 lg:gap-7 lg:px-10 overflow-y-auto no-scrollbar">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="h-40 lg:h-64"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            className="h-full"
          >
            <MascotHello
              variant={mascotVariant}
              className="h-full w-auto object-contain drop-shadow-[0_12px_32px_rgba(240,86,86,0.35)]"
            />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <span className="text-xs lg:text-sm font-extrabold uppercase tracking-widest text-amber-300">
            Lição concluída!
          </span>
          <h1 className="text-2xl lg:text-4xl font-extrabold text-white mt-2">{lessonTitle}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full lg:max-w-lg grid grid-cols-2 gap-2.5 lg:gap-4"
        >
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 lg:p-5 flex flex-col items-center">
            <Target className="w-6 h-6 text-sky-400 mb-1" />
            <span className="text-xl lg:text-3xl font-extrabold text-white">
              {firstTryCorrect}/{total}
            </span>
            <span className="text-[11px] lg:text-sm text-neutral-400">
              {isPerfect ? "acertos de primeira, perfeito!" : "acertos de primeira"}
            </span>
          </div>

          <div
            className={cn(
              "rounded-xl border p-3 lg:p-5 flex flex-col items-center",
              streak.active_today ? "bg-amber-500/10 border-amber-400/40" : "bg-white/5 border-white/10"
            )}
          >
            <StreakFlame lit={streak.active_today}>
              <Flame
                className={cn(
                  "w-6 h-6 mb-1",
                  streak.active_today
                    ? "text-amber-400 fill-amber-400/40 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                    : "text-neutral-400"
                )}
              />
            </StreakFlame>
            <span className="text-xl lg:text-3xl font-extrabold text-white">{days}</span>
            <span className="text-[11px] lg:text-sm text-neutral-400">
              {days === 1 ? "dia de ofensiva" : "dias de ofensiva"}
            </span>
          </div>
        </motion.div>
      </main>

      <ImmersiveFooter>
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onContinue}
          autoFocus
          className="w-full py-3.5 sm:py-4 rounded-xl font-bold text-white text-base bg-red border-b-4 border-red-dark active:border-b-0 active:translate-y-0.5 transition-all shadow-lg hover:brightness-105 focus-visible:outline-none cursor-pointer"
        >
          Continuar
        </motion.button>
      </ImmersiveFooter>
    </>
  );
}
