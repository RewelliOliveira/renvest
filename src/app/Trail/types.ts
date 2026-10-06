export type NodeStatus = "completed" | "current" | "locked";
export type NodeType = "lesson" | "quiz" | "chest" | "boss";

export interface TrailNodeItem {
  id: string;
  moduleId: string;
  title: string;
  subtitle: string;
  type: NodeType;
  status: NodeStatus;
  stars?: number; // 0 a 3 estrelas para nós concluídos
  xpReward: number;
  coinReward: number;
  positionX: number; // -1 (esquerda), 0 (centro), 1 (direita) para a curva
  route?: string;
  description?: string;
  chestOpened?: boolean;
}

export interface TrailModule {
  id: string;
  sectionNumber: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  nodes: TrailNodeItem[];
}

export interface UserStats {
  streak: number;
  xp: number;
  coins: number;
  hearts: number;
  maxHearts: number;
}
