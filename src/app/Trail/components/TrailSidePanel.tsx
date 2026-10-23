import { Link } from "react-router-dom";
import { FireIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { MascotHello } from "@/assets/icons";
import { useAvatar } from "@/lib/avatar";
import { SidePanel, PanelCard } from "@/components/layout/SidePanel";
import { ModuleProgressList } from "./ModuleProgressList";
import { StreakFlame } from "./StreakFlame";
import type { TrailData } from "../types/types";

export function TrailSidePanel({ trail }: { trail: TrailData }) {
  const [avatar] = useAvatar();
  const { current_days: days, active_today: lit } = trail.streak;

  return (
    <SidePanel>
      <PanelCard title="Ofensiva">
        <div className="flex items-center gap-4">
          <StreakFlame lit={lit}>
            <FireIcon
              weight={lit ? "fill" : undefined}
              className={cn(
                "w-12 h-12 shrink-0",
                lit ? "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" : "text-neutral-500"
              )}
            />
          </StreakFlame>
          <div className="min-w-0">
            <p className={cn("font-heading text-2xl font-extrabold tabular-nums", lit ? "text-amber-200" : "text-white")}>
              {days} {days === 1 ? "dia" : "dias"}
            </p>
            <p className="type-caption text-neutral-400 mt-0.5">
              {lit ? "Você já estudou hoje. Continue assim!" : "Conclua uma lição hoje para manter a ofensiva."}
            </p>
          </div>
        </div>
      </PanelCard>

      <PanelCard title="Seu progresso">
        <p className="type-body text-neutral-300 mb-4">
          <span className="font-heading text-lg font-extrabold tabular-nums text-white">{trail.progress.completed_lessons}</span>
          <span className="text-neutral-400">/{trail.progress.total_lessons}</span> lições concluídas
        </p>
        <ModuleProgressList modules={trail.modules} />
      </PanelCard>

      <PanelCard>
        <div className="flex items-center gap-3">
          <MascotHello variant={avatar} className="h-16 w-auto shrink-0 object-contain" />
          <div className="min-w-0">
            <h2 className="type-h4 text-white">Ficou com dúvida?</h2>
            <p className="type-caption text-neutral-400 mt-0.5">
              O Rev responde com base em fontes oficiais.
            </p>
          </div>
        </div>
        <Link
          to="/chat"
          className="mt-4 block w-full py-2.5 rounded-xl text-center type-button-sm text-white bg-red border-b-4 border-red-dark press-3d hover:brightness-105 transition-all"
        >
          Perguntar ao Rev
        </Link>
      </PanelCard>
    </SidePanel>
  );
}
