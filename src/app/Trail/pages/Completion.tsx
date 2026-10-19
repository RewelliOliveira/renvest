import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BookOpenCheck, Layers, MessageSquare } from "lucide-react";
import { StarBurst } from "@/components/ui/starsUI";
import { MascotLoader } from "@/components/ui/MascotLoader";
import { MascotHello } from "@/assets/icons";
import { useAuth } from "@/app/AuthLogin/hooks/useAuth";
import { useAvatar } from "@/lib/avatar";
import { StreakBadge } from "../components/StreakBadge";
import { useTrail } from "../hooks/useTrail";

export function Completion() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trail, isLoading } = useTrail();
  const [avatar] = useAvatar();
  const firstName = user?.name?.split(" ")[0];

  if (isLoading && !trail) {
    return <MascotLoader title="Carregando sua conquista" />;
  }

  if (!trail?.completed) {
    return <Navigate to="/trail" replace />;
  }

  return (
    <StarBurst className="min-h-dvh w-full overflow-x-hidden text-white flex flex-col" maxHeightPercent={100} fixed>
      <main className="flex-1 w-full max-w-md mx-auto flex flex-col items-center justify-center text-center px-6 py-10 gap-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="h-48 flex items-center justify-center"
        >
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }} className="h-full">
            <MascotHello variant={avatar} className="h-full w-auto object-contain drop-shadow-[0_12px_32px_rgba(240,86,86,0.35)]" />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">Trilha concluída</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
            Parabéns{firstName ? `, ${firstName}` : ""}! 🎉
          </h1>
          <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
            Você concluiu os módulos do Renvest: dos fundamentos de finanças à bolsa de valores e à regulação da CVM.
            Agora você sabe onde encontrar as informações oficiais para investir com mais autonomia.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full grid grid-cols-2 gap-2.5"
        >
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col items-center">
            <Layers className="w-5 h-5 text-sky-400 mb-1" />
            <span className="text-lg font-extrabold">{trail.progress.completed_modules}</span>
            <span className="text-[11px] text-neutral-400">módulos concluídos</span>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col items-center">
            <BookOpenCheck className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-lg font-extrabold">{trail.progress.completed_lessons}</span>
            <span className="text-[11px] text-neutral-400">lições concluídas</span>
          </div>
        </motion.div>

        <StreakBadge streak={trail.streak} />

        <div className="w-full flex flex-col gap-2.5 mt-2">
          <button
            type="button"
            onClick={() => navigate("/chat")}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-red border-b-4 border-red-dark active:border-b-0 active:translate-y-0.5 hover:brightness-105 cursor-pointer flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Continuar conversando com o Rev
          </button>
          <button
            type="button"
            onClick={() => navigate("/trail")}
            className="w-full py-3 rounded-xl font-bold text-white/85 text-sm border border-white/15 bg-white/5 hover:bg-white/10 cursor-pointer"
          >
            Voltar para a trilha
          </button>
        </div>
      </main>
    </StarBurst>
  );
}
