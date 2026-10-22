import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "cn";
import { NAV_TABS } from "./navTabs";

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#000815]/90 backdrop-blur-md border-t border-white/10 px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                cn(
                  "relative flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-colors cursor-pointer font-bold",
                  isActive ? "text-red" : "text-white/40 hover:text-white/80"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="bottom-nav-active"
                      className="absolute inset-0 rounded-xl border-2 border-red/50 bg-red/10"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <Icon
                    weight={isActive ? "fill" : "bold"}
                    className={cn(
                      "relative w-5 h-5 sm:w-6 sm:h-6 transition-colors",
                      isActive && "drop-shadow-[0_2px_8px_rgba(240,86,86,0.6)]"
                    )}
                  />
                  <span className="relative font-heading text-[11px] sm:text-xs mt-1">{tab.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
