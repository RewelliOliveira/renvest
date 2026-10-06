import { Compass, BookOpen, Trophy, User } from "lucide-react";
import { cn } from "cn";

interface BottomNavProps {
  currentTab?: "trail" | "library" | "ranking" | "profile";
  onTabChange?: (tab: "trail" | "library" | "ranking" | "profile") => void;
}

export function BottomNav({ currentTab = "trail", onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "trail" as const, label: "Trilha", icon: Compass },
    { id: "library" as const, label: "Conteúdos", icon: BookOpen },
    { id: "ranking" as const, label: "Ranking", icon: Trophy },
    { id: "profile" as const, label: "Perfil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#000815]/90 backdrop-blur-md border-t border-white/10 px-4 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange && onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer",
                isActive
                  ? "text-red font-bold scale-105"
                  : "text-white/40 hover:text-white/80 font-medium"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 sm:w-6 sm:h-6 transition-colors",
                    isActive && "text-red drop-shadow-[0_2px_8px_rgba(240,86,86,0.6)]"
                  )}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red" />
                )}
              </div>
              <span className="text-[11px] sm:text-xs mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
