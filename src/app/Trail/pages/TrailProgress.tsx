import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { WarningCircleIcon, ConfettiIcon, ArrowClockwiseIcon } from "@phosphor-icons/react";
import { cn } from "cn";
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
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [justCompletedKey] = useState<string | null>(
    () => (location.state as { completedNodeKey?: string } | null)?.completedNodeKey ?? null,
  );

  const modules = useMemo(
    () =>
      (trail?.modules ?? []).map((module, index) => ({
        module,
        nodes: buildNodes(module, index),
      })),
    [trail],
  );

  const currentNodeKey = useMemo(
    () =>
      modules
        .flatMap(({ nodes }) => nodes)
        .find((node) => node.status === "current")?.key ?? null,
    [modules],
  );
  const scrolledNodeKey = useRef<string | null>(null);
  const stickyBannerRef = useRef<HTMLDivElement>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const activeModule =
    modules.find(({ module }) => module.id === activeModuleId)?.module ?? modules[0]?.module;

  useEffect(() => {
    if (!modules.length) return;
    let frame = 0;
    const updateActiveModule = () => {
      frame = 0;
      const limit = stickyBannerRef.current?.getBoundingClientRect().bottom ?? 0;
      const sections = document.querySelectorAll<HTMLElement>("[data-module-id]");
      let activeId = sections[0]?.dataset.moduleId ?? null;
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= limit + 1) activeId = section.dataset.moduleId ?? activeId;
      });
      setActiveModuleId(activeId);
    };
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateActiveModule);
    };
    updateActiveModule();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [modules]);

  useEffect(() => {
    if (!currentNodeKey || scrolledNodeKey.current === currentNodeKey) return;
    scrolledNodeKey.current = currentNodeKey;
    document
      .getElementById("trail-current-node")
      ?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [currentNodeKey]);

  useEffect(() => {
    if (justCompletedKey) navigate(location.pathname, { replace: true, state: null });
  }, [justCompletedKey, navigate, location.pathname]);

  useEffect(() => {
    if (!selectedKey) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedKey(null);
    };
    const handleUserScroll = (event: Event) => {
      const target = event.target as Element | null;
      if (target?.closest?.(`[data-node-key="${selectedKey}"]`)) return;
      setSelectedKey(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchmove", handleUserScroll, { passive: true });
    window.addEventListener("wheel", handleUserScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchmove", handleUserScroll);
      window.removeEventListener("wheel", handleUserScroll);
    };
  }, [selectedKey]);

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
            className="flex-1 w-full flex flex-col items-center [--trail-spread:1] lg:[--trail-spread:1.6]"
            onClick={() => setSelectedKey(null)}
          >
            {isLoading && !trail && <MascotLoader title="Carregando sua trilha" />}

            {error && !trail && (
              <div className="mt-16 mx-4 w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-red-950/50 border border-red-500/30 p-4 text-center">
                <WarningCircleIcon className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <p className="type-body text-red-100">{error}</p>
                <button
                  type="button"
                  onClick={reload}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red text-white type-button-sm cursor-pointer hover:brightness-105"
                >
                  <ArrowClockwiseIcon className="w-4 h-4" />
                  Tentar de novo
                </button>
              </div>
            )}

            {activeModule && (
              <div
                ref={stickyBannerRef}
                className="lg:hidden sticky top-14 sm:top-15 z-30 w-full bg-[#000815]"
              >
                <motion.div
                  key={activeModule.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <SectionBanner module={activeModule} />
                </motion.div>
              </div>
            )}

            {modules.map(({ module, nodes }, index) => (
              <section
                key={module.id}
                data-module-id={module.id}
                className="w-full flex flex-col items-center"
              >
                <SectionBanner module={module} className="hidden lg:block" />

                {index > 0 && (
                  <div className="lg:hidden w-full max-w-lg flex items-center gap-4 px-6 pt-6">
                    <span className="flex-1 h-0.5 rounded-full bg-white/15" />
                    <span className="shrink min-w-0 truncate font-heading text-base font-bold text-neutral-400">
                      {module.title}
                    </span>
                    <span className="flex-1 h-0.5 rounded-full bg-white/15" />
                  </div>
                )}

                <div
                  className={cn(
                    "w-full max-w-lg lg:max-w-2xl flex-1 flex flex-col items-center justify-center gap-6 lg:gap-9 px-4 pt-16 lg:pt-14 lg:pb-20",
                    index === modules.length - 1 && !trail?.completed ? "pb-28" : "pb-12",
                  )}
                >
                  {nodes.map((node) => (
                    <TrailNode
                      key={node.key}
                      node={node}
                      isSelected={selectedKey === node.key}
                      justCompleted={justCompletedKey === node.key}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </section>
            ))}

            {trail?.completed && (
              <div className="w-[calc(100%-2rem)] max-w-md lg:max-w-2xl mx-4 mt-6 mb-32 lg:mb-12 rounded-2xl bg-linear-to-br from-amber-500/15 to-red/15 border border-amber-400/30 p-5 text-center shadow-xl">
                <ConfettiIcon className="w-8 h-8 text-amber-300 mx-auto mb-2" />
                <h3 className="type-h3">Trilha concluída!</h3>
                <p className="type-caption text-neutral-300 mt-1">
                  Você completou os {trail.progress.total_modules} módulos do
                  Renvest.
                </p>
                <div className="flex justify-center mt-3">
                  <StreakBadge streak={trail.streak} />
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/conclusao")}
                  className="mt-4 w-full py-3 rounded-xl font-bold text-white bg-red border-b-4 border-red-dark press-3d hover:brightness-105 cursor-pointer"
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
