import type { TrailModule } from "../types/types";

interface SectionBannerProps {
  module: TrailModule;
}

export function SectionBanner({ module }: SectionBannerProps) {
  return (
    <div className="w-full max-w-md mx-auto my-3 px-4">
      <div className="rounded-2xl bg-[#071329]/90 border border-white/10 px-5 py-4 text-center shadow-lg backdrop-blur-xs">
        <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-sky-400">
          Módulo {module.sectionNumber}
        </span>
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">
          {module.title}
        </h2>
      </div>
    </div>
  );
}
