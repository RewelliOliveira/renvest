import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, PartyPopper, RefreshCw } from "lucide-react";
import { StarBurst } from "@/components/ui/starsUI";
import { MascotLoader } from "@/components/ui/MascotLoader";
import { TrailHeader } from "../components/TrailHeader";
import { SectionBanner } from "../components/SectionBanner";
import { TrailNode } from "../components/TrailNode";
import { StreakBadge } from "../components/StreakBadge";
import { TrailSidePanel } from "../components/TrailSidePanel";
import { useTrail } from "../hooks/useTrail";
import type { TrailModule, TrailNodeItem } from "../types/types";

const NODE_OFFSETS = [0, 48, 72, 48, 0];

function buildNodes(module: TrailModule, moduleIndex: number): TrailNodeItem[] {
  const side = moduleIndex % 2 === 0 ? 1 : -1;
  const offsetAt = (index: number) =>
    NODE_OFFSETS[index % NODE_OFFSETS.length] * side;

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
    () =>
      (trail?.modules ?? []).map((module, index) => ({
        module,
        nodes: buildNodes(module, index),
      })),
    [trail],
  );

  useEffect(() => {
    if (trail && !trail.completed) {
      document
        .getElementById("trail-current-node")
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [trail]);

  useEffect(() => {
    const root = document.documentElement;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const applySnap = () => {
      root.style.scrollSnapType = desktop.matches ? "" : "y proximity";
      root.style.scrollPaddingTop = desktop.matches
        ? ""
        : window.matchMedia("(min-width: 640px)").matches
          ? "3.75rem"
          : "3.5rem";
    };
    applySnap();
    desktop.addEventListener("change", applySnap);
    return () => {
      desktop.removeEventListener("change", applySnap);
      root.style.scrollSnapType = "";
      root.style.scrollPaddingTop = "";
    };
  }, []);

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
    <StarBurst
      className="min-h-dvh h-auto w-full overflow-visible overflow-x-clip text-white flex flex-col"
      maxHeightPercent={100}
      fixed
    >
      <div className="w-full flex">
        <div className="flex-1 min-w-0 flex flex-col">
          <TrailHeader trail={trail} />

          <main
            className="flex-1 w-full flex flex-col items-center [--trail-header-height:3.5rem] sm:[--trail-header-height:3.75rem] [--trail-spread:1] lg:[--trail-spread:1.6]"
            onClick={() => setSelectedKey(null)}
          >
            {isLoading && !trail && <MascotLoader title="Carregando sua trilha" />}

            {error && !trail && (
              <div className="mt-16 mx-4 w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-red-950/50 border border-red-500/30 p-4 text-center">
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
              <section
                key={module.id}
                className="w-full min-h-[calc(100dvh-var(--trail-header-height))] lg:min-h-0 snap-start flex flex-col items-center border-t border-white/5 lg:border-0 [background:var(--module-bg)] lg:[background:none]"
                style={{
                  ["--module-bg" as string]: `linear-gradient(to bottom, color-mix(in srgb, ${module.color} 14%, transparent), color-mix(in srgb, ${module.color} 4%, transparent))`,
                }}
              >
                <SectionBanner module={module} />

                <div className="w-full max-w-lg lg:max-w-2xl flex-1 flex flex-col items-center justify-center gap-6 lg:gap-9 px-4 pt-8 pb-28 lg:pt-14 lg:pb-20">
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
              <div className="w-[calc(100%-2rem)] max-w-md lg:max-w-2xl mx-4 mt-6 mb-32 lg:mb-12 rounded-2xl bg-linear-to-br from-amber-500/15 to-red/15 border border-amber-400/30 p-5 text-center shadow-xl">
                <PartyPopper className="w-8 h-8 text-amber-300 mx-auto mb-2" />
                <h3 className="text-lg font-bold">Trilha concluída!</h3>
                <p className="text-xs text-neutral-300 mt-1">
                  Você completou os {trail.progress.total_modules} módulos do
                  Renvest.
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
        </div>

        {trail && <TrailSidePanel trail={trail} />}
      </div>
    </StarBurst>
  );
}
