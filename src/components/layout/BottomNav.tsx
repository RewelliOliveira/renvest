import { NavLink } from "react-router-dom";
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
                  "flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all cursor-pointer",
                  isActive
                    ? "text-red font-bold scale-105"
                    : "text-white/40 hover:text-white/80 font-medium"
                )
              }
            >
              {({ isActive }) => (
                <>
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
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
