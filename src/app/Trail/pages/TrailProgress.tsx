import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, PartyPopper, RefreshCw } from "lucide-react";
import { StarBurst } from "@/components/ui/starsUI";
import { TrailHeader } from "../components/TrailHeader";
import { SectionBanner } from "../components/SectionBanner";
import { TrailNode } from "../components/TrailNode";
import { BottomNav } from "../components/BottomNav";
import { StreakBadge } from "../components/StreakBadge";
import { useTrail } from "../hooks/useTrail";
import type { TrailModule, TrailNodeItem } from "../types/types";

// Deslocamento horizontal (px) dos nós; cada módulo curva para um lado
const NODE_OFFSETS = [0, 48, 72, 48, 0];

function buildNodes(module: TrailModule, moduleIndex: number): TrailNodeItem[] {
  const side = moduleIndex % 2 === 0 ? 1 : -1;
  const offsetAt = (index: number) => NODE_OFFSETS[index % NODE_OFFSETS.length] * side;

  const lessons: TrailNodeItem[] = module.lessons.map((lesson, index) => ({
    kind: "lesson",
    key: lesson.id,
    module,
    lesson,
    status: lesson.status,
    positionX: offsetAt(index),
  }));
  return [
    ...lessons,
    {
      kind: "exam",
      key: `${module.id}-exam`,
      module,
      exam: module.exam,
      status: module.exam.status,
      positionX: offsetAt(lessons.length),
    },
  ];
}

export function TrailProgress() {
  const navigate = useNavigate();
  const { trail, isLoading, error, reload } = useTrail();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const modules = useMemo(
    () => (trail?.modules ?? []).map((module, index) => ({ module, nodes: buildNodes(module, index) })),
    [trail]
  );

  useEffect(() => {
    if (trail && !trail.completed) {
      document.getElementById("trail-current-node")?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [trail]);

  useEffect(() => {
    if (!selectedKey) return;
    document
      .querySelector(`[data-node-key="${selectedKey}"]`)
      ?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [selectedKey]);

  const handleSelect = (node: TrailNodeItem) => {
    setSelectedKey((current) => (current === node.key ? null : node.key));
  };

  return (
    <StarBurst className="min-h-dvh h-auto w-full overflow-visible overflow-x-clip text-white flex flex-col" maxHeightPercent={100} fixed>
      <TrailHeader trail={trail} />

      <main
        className="flex-1 w-full max-w-lg mx-auto flex flex-col items-center px-4 pb-32"
        onClick={() => setSelectedKey(null)}
      >
        {isLoading && !trail && (
          <div className="flex flex-col items-center gap-3 py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-red border-t-transparent" />
            <p className="text-sm text-neutral-400">Carregando sua trilha...</p>
          </div>
        )}

        {error && !trail && (
          <div className="mt-16 w-full max-w-sm rounded-2xl bg-red-950/50 border border-red-500/30 p-4 text-center">
            <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-red-100">{error}</p>
            <button
              type="button"
              onClick={reload}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red text-white text-sm font-bold cursor-pointer hover:brightness-105"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar de novo
            </button>
          </div>
        )}

        {modules.map(({ module, nodes }) => (
          <section key={module.id} className="w-full flex flex-col items-center">
            <SectionBanner module={module} />

            <div className="w-full flex flex-col items-center gap-6 pt-8 pb-14">
              {nodes.map((node) => (
                <TrailNode
                  key={node.key}
                  node={node}
                  isSelected={selectedKey === node.key}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </section>
        ))}

        {trail?.completed && (
          <div className="w-full max-w-md rounded-2xl bg-linear-to-br from-amber-500/15 to-red/15 border border-amber-400/30 p-5 text-center shadow-xl">
            <PartyPopper className="w-8 h-8 text-amber-300 mx-auto mb-2" />
            <h3 className="text-lg font-bold">Trilha concluída!</h3>
            <p className="text-xs text-neutral-300 mt-1">
              Você completou os {trail.progress.total_modules} módulos do Renvest.
            </p>
            <div className="flex justify-center mt-3">
              <StreakBadge streak={trail.streak} />
            </div>
            <button
              type="button"
              onClick={() => navigate("/conclusao")}
              className="mt-4 w-full py-3 rounded-xl font-bold text-white bg-red border-b-4 border-red-dark active:border-b-0 active:translate-y-0.5 hover:brightness-105 cursor-pointer"
            >
              Ver minha conquista
            </button>
          </div>
        )}
      </main>

      <BottomNav currentTab="trail" />
    </StarBurst>
  );
}
