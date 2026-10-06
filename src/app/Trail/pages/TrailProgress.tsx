import { useState } from "react";
import { StarBurst } from "@/components/ui/starsUI";
import { TrailHeader } from "../components/TrailHeader";
import { SectionBanner } from "../components/SectionBanner";
import { TrailNode } from "../components/TrailNode";
import { MissionModal } from "../components/MissionModal";
import { BottomNav } from "../components/BottomNav";
import { TRAIL_MODULES, INITIAL_USER_STATS } from "../data/trailData";
import type { TrailNodeItem, UserStats } from "../types";

export function TrailProgress() {
  const [stats, setStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [modules, setModules] = useState(TRAIL_MODULES);
  const [selectedNode, setSelectedNode] = useState<TrailNodeItem | null>(null);
  const [currentTab, setCurrentTab] = useState<"trail" | "library" | "ranking" | "profile">("trail");

  const currentModule = modules[0];
  const completedNodesCount = currentModule.nodes.filter(
    (n) => n.status === "completed"
  ).length;

  const handleNodeClick = (node: TrailNodeItem) => {
    setSelectedNode(node);
  };

  const handleOpenChest = (nodeId: string) => {
    setModules((prev) =>
      prev.map((mod) => ({
        ...mod,
        nodes: mod.nodes.map((n) =>
          n.id === nodeId ? { ...n, status: "completed", chestOpened: true } : n
        ),
      }))
    );
    // Adiciona recompensa de baú
    if (selectedNode) {
      setStats((prev) => ({
        ...prev,
        xp: prev.xp + selectedNode.xpReward,
        coins: prev.coins + selectedNode.coinReward,
      }));
    }
    setSelectedNode(null);
  };

  return (
    <StarBurst
      className="min-h-dvh w-full overflow-x-hidden text-white flex flex-col"
      maxHeightPercent={35}
    >
      {/* Barra de Status e Gamificação Fixa */}
      <TrailHeader stats={stats} />

      {/* Conteúdo Principal da Trilha */}
      <main className="flex-1 w-full max-w-lg mx-auto flex flex-col items-center px-4 pt-2 pb-28">
        {/* Banner da Seção Atual */}
        <SectionBanner
          module={currentModule}
          completedCount={completedNodesCount}
          totalCount={currentModule.nodes.length}
        />

        {/* Trilha de Nós / Caminho do Conhecimento */}
        <div className="relative w-full flex flex-col items-center mt-3">
          {/* Linha de Conexão Sinuosa de Fundo (SVG) */}
          <svg
            className="absolute top-10 left-0 w-full h-[85%] pointer-events-none z-0 overflow-visible opacity-30"
            viewBox="0 0 320 620"
            fill="none"
          >
            <path
              d="M 160 30 Q 210 90 208 140 T 176 250 T 118 360 T 144 470 T 160 580"
              stroke="#A4D6FF"
              strokeWidth="4"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
          </svg>

          {/* Renderização dos Nós */}
          <div className="relative z-10 w-full flex flex-col items-center gap-2">
            {currentModule.nodes.map((node) => (
              <TrailNode
                key={node.id}
                node={node}
                isCurrent={node.status === "current"}
                onSelect={handleNodeClick}
              />
            ))}
          </div>

          {/* Próxima Seção Bloqueada (Preview) */}
          <div className="w-full mt-10 pt-4 border-t border-white/10 flex flex-col items-center text-center opacity-60">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-400">
              Próxima Seção
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              {modules[1]?.title || "Renda Fixa na Prática"}
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs">
              Conclua o Desafio da Seção 1 para desbloquear o próximo módulo!
            </p>
          </div>
        </div>
      </main>

      {/* Modal / Card de Missão ao clicar em um Nó */}
      <MissionModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onOpenChest={handleOpenChest}
      />

      {/* Barra de Navegação Inferior */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </StarBurst>
  );
}
