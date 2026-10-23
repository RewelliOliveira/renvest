import { CompassIcon, ChatsCircleIcon, UserCircleIcon, type Icon } from "@phosphor-icons/react";

export interface NavTab {
  label: string;
  icon: Icon;
  path: string;
}

export const NAV_TABS: NavTab[] = [
  { label: "Trilha", icon: CompassIcon, path: "/trail" },
  { label: "Chat", icon: ChatsCircleIcon, path: "/chat" },
  { label: "Perfil", icon: UserCircleIcon, path: "/profile" },
];
