import { useMemo, type ReactNode } from "react";
import { motion } from "motion/react";
import { FireIcon, TargetIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { MascotCelebrate } from "@/assets/icons";
import { MASCOT_PALETTES, type MascotVariant } from "@/assets/mascotPalettes";
import { Confetti } from "@/components/ui/Confetti";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { ImmersiveFooter } from "@/components/layout/ImmersiveFooter";
import { StreakFlame } from "@/app/Trail/components/StreakFlame";
import type { Streak } from "@/app/Trail/types/types";

const TILE_CLASS =
  "rounded-2xl bg-option-dark border border-white/10 border-b-4 border-b-option-dark-border";

interface LessonCompleteProps {
  lessonTitle: string;
  firstTryCorrect: number;
  total: number;
  streak: Streak;
  mascotVariant: MascotVariant;
  onContinue: () => void;
}

function revMessage(lessonTitle: string, firstTryCorrect: number, total: number, streak: Streak): string {
  const opening =
    firstTryCorrect === total
      ? `Gabaritou "${lessonTitle}"! Acertou tudo de primeira.`
      : `Mandou bem! "${lessonTitle}" está concluída.`;
  if (streak.active_today && streak.current_days > 1) {
    return `${opening} Já são ${streak.current_days} dias seguidos estudando comigo.`;
  }
  return firstTryCorrect === total ? opening : `${opening} Bora para a próxima?`;
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
  const lit = streak.active_today;
  const palette = MASCOT_PALETTES[mascotVariant];
  const confettiColors = useMemo(
    () => [palette.base, palette.highlightFrom, "#fbbf24", "#38bdf8", "#34d399", "#ffffff"],
    [palette],
  );

  return (
    <>
      <Confetti colors={confettiColors} />

      <main className="flex-1 min-h-0 w-full flex flex-col items-center justify-center py-2 lg:px-10 overflow-y-auto no-scrollbar">
        <div className="w-full flex flex-col items-center lg:max-w-5xl lg:flex-row-reverse lg:items-center lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 26, delay: 0.35 }}
            className="w-full flex flex-col items-center lg:items-stretch lg:flex-1 lg:max-w-xl"
          >
            <SpeechBubble direction="auto">{revMessage(lessonTitle, firstTryCorrect, total, streak)}</SpeechBubble>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 13 }}
            className="mt-4 sm:mt-6 lg:mt-0 h-48 sm:h-56 lg:h-80 flex items-center justify-center lg:shrink-0"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="h-full"
            >
              <MascotCelebrate variant={mascotVariant} className="h-full w-auto" />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-sm sm:max-w-md lg:max-w-5xl mt-5 lg:mt-10 grid grid-cols-2 gap-3 lg:gap-4"
        >
          <ResultTile
            icon={<TargetIcon weight="duotone" className="w-7 h-7 text-sky-400" />}
            value={`${firstTryCorrect}/${total}`}
            label="acertos de primeira"
          >
            <div className="flex gap-1 mt-2.5">
              {Array.from({ length: total }, (_, index) => (
                <motion.span
                  key={index}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8 + index * 0.08 }}
                  className={cn("h-1.5 flex-1 rounded-full origin-left", index < firstTryCorrect ? "bg-sky-400" : "bg-white/10")}
                />
              ))}
            </div>
          </ResultTile>

          <ResultTile
            icon={
              <StreakFlame lit={lit}>
                <FireIcon
                  weight={lit ? "fill" : "duotone"}
                  className={cn(
                    "w-7 h-7",
                    lit ? "text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" : "text-neutral-500"
                  )}
                />
              </StreakFlame>
            }
            value={String(days)}
            label={days === 1 ? "dia de ofensiva" : "dias de ofensiva"}
            valueClassName={lit ? "text-amber-200" : undefined}
          />
        </motion.div>
      </main>

      <ImmersiveFooter>
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onContinue}
          autoFocus
          className="w-full py-3.5 sm:py-4 rounded-xl type-button text-white bg-red border-b-4 border-red-dark press-3d transition-all shadow-lg hover:brightness-105 focus-visible:outline-none cursor-pointer"
        >
          Continuar
        </motion.button>
      </ImmersiveFooter>
    </>
  );
}

interface ResultTileProps {
  icon: ReactNode;
  value: string;
  label: string;
  valueClassName?: string;
  children?: ReactNode;
}

function ResultTile({ icon, value, label, valueClassName, children }: ResultTileProps) {
  return (
    <div className={cn(TILE_CLASS, "p-3.5 lg:p-5 min-w-0")}>
      <div className="flex items-center gap-3 lg:gap-4 min-w-0">
        <span className="shrink-0 inline-flex">{icon}</span>
        <div className="min-w-0">
          <p className={cn("type-stat text-white truncate", valueClassName)}>{value}</p>
          <p className="type-stat-label text-neutral-400 truncate mt-1">{label}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
