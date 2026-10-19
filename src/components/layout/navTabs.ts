import { Compass, MessageSquare, User, type LucideIcon } from "lucide-react";

export interface NavTab {
  label: string;
  icon: LucideIcon;
  path: string;
}

export const NAV_TABS: NavTab[] = [
  { label: "Trilha", icon: Compass, path: "/trail" },
  { label: "Chat", icon: MessageSquare, path: "/chat" },
  { label: "Perfil", icon: User, path: "/profile" },
];
