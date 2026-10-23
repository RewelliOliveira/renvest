import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "cn";
import { LogomarcaIcon, MascotHello } from "@/assets/icons";
import { useAuth } from "@/app/AuthLogin/hooks/useAuth";
import { useAvatar } from "@/lib/avatar";
import { NAV_TABS } from "./navTabs";

export function SideNav() {
  const { user } = useAuth();
  const [avatar] = useAvatar();
  const displayName = user?.name || "Investidor";

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-(--side-nav-width) flex-col bg-[#000815]/95 backdrop-blur-md border-r border-white/10 px-4 py-6">
      <NavLink to="/trail" className="px-3 mb-8" aria-label="Renvest - ir para a trilha">
        <LogomarcaIcon className="h-8 w-auto object-contain drop-shadow-[0_2px_8px_rgba(240,86,86,0.3)]" />
      </NavLink>

      <nav className="flex flex-col gap-1.5">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-4 px-4 py-3 rounded-xl border-2 border-transparent type-button-sm uppercase transition-colors cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/60",
                  isActive ? "text-red-light" : "text-white/60 hover:bg-white/5 hover:text-white"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="side-nav-active"
                      className="absolute -inset-0.5 rounded-xl border-2 border-red/50 bg-red/10"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <Icon
                    weight={isActive ? "fill" : "bold"}
                    className={cn(
                      "relative w-6 h-6 shrink-0 transition-transform group-hover:scale-110",
                      isActive && "text-red drop-shadow-[0_2px_8px_rgba(240,86,86,0.6)]"
                    )}
                  />
                  <span className="relative">{tab.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <NavLink
        to="/profile"
        className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors cursor-pointer"
      >
        <span className="w-10 h-10 rounded-xl bg-linear-to-br from-red/30 to-sky-500/20 border border-white/15 p-1 flex items-center justify-center shrink-0">
          <MascotHello variant={avatar} className="h-full w-auto object-contain" />
        </span>
        <span className="min-w-0">
          <span className="block type-h4 text-white truncate">{displayName}</span>
          <span className="block type-micro text-neutral-400">Ver perfil</span>
        </span>
      </NavLink>
    </aside>
  );
}
