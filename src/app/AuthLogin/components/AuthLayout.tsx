import * as React from "react";
import { StarBurst } from "@/components/ui/starsUI";
import { LogomarcaIcon, MascotIcon } from "@/assets/icons";

export interface AuthLayoutProps {
  mode: "login" | "register";
  title: string;
  navLabel: string;
  onNavigate?: () => void;
  children: React.ReactNode;
  mobileBrand?: React.ReactNode;
}

export function AuthLayout({
  mode,
  title,
  navLabel,
  onNavigate,
  children,
  mobileBrand,
}: AuthLayoutProps) {
  return (
    <StarBurst className="h-dvh w-full overflow-hidden" maxHeightPercent={45}>
      <div className="relative h-dvh w-full flex flex-col justify-between overflow-hidden text-white">
        <header className="lg:hidden shrink-0 flex justify-end items-center px-6 pt-4 pb-1 z-20">
          <button
            type="button"
            onClick={onNavigate}
            className="relative px-1 py-0.5 text-sm font-bold text-white/90 hover:text-white transition-all cursor-pointer"
          >
            {navLabel}
            <span className="absolute -bottom-0.5 left-0 w-full h-0.5 rounded-full bg-linear-to-r from-transparent via-red-light/80 to-transparent shadow-[0_1px_8px_rgba(254,120,113,0.65)]" />
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center w-full px-6 lg:px-12 py-2 min-h-0 z-10">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-4xl xl:max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
            <section className="hidden lg:flex lg:col-span-6 flex-col items-center justify-between h-120 py-4 select-none">
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <MascotIcon className="w-44 xl:w-52 h-auto drop-shadow-[0_12px_40px_rgba(240,86,86,0.25)]" />
                <LogomarcaIcon className="h-8 xl:h-9 w-auto object-contain" />
              </div>
              <div className="text-xs text-neutral-500 text-center">
                Projeto de Graduação (TCC) • Democratizando a educação financeira no Brasil
              </div>
            </section>

            <section className="col-span-1 lg:col-span-6 w-full flex flex-col justify-center">
              <div className="w-full bg-transparent lg:bg-white/3 lg:border lg:border-white/10 lg:backdrop-blur-md lg:rounded-2xl lg:p-8 lg:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="hidden lg:flex items-center justify-between pb-5 mb-5 border-b border-white/10">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {title}
                  </h2>
                  <button
                    type="button"
                    onClick={onNavigate}
                    className="group relative px-1 py-0.5 text-xs sm:text-sm font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {mode === "login" ? "Cadastre-se" : "Entrar"}
                    <span className="absolute -bottom-0.5 left-0 w-full h-0.5 rounded-full bg-linear-to-r from-transparent via-red-light/80 to-transparent shadow-[0_1px_8px_rgba(254,120,113,0.65)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>

                <div className="lg:hidden">
                  {mobileBrand}
                </div>

                <div className="w-full">
                  {children}
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="lg:hidden shrink-0 h-2" />
      </div>
    </StarBurst>
  );
}
