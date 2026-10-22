import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { CaretLeftIcon, type Icon } from "@phosphor-icons/react";

interface ProfileSubpageProps {
  title: string;
  children: ReactNode;
}

export function ProfileSubpage({ title, children }: ProfileSubpageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh w-full overflow-x-hidden bg-linear-to-b from-[#000815] via-[#00050d] to-[#000000] text-white flex flex-col">
      <header className="sticky top-0 z-30 w-full bg-[#000815]/85 backdrop-blur-md border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="max-w-md lg:max-w-5xl mx-auto relative flex items-center justify-center">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            aria-label="Voltar ao perfil"
            className="absolute left-0 p-1 -ml-1 rounded-lg text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <CaretLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="type-h3">{title}</h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md lg:max-w-5xl mx-auto px-4 lg:px-8 py-5 lg:py-10 pb-28 lg:pb-10 flex flex-col gap-4 lg:block lg:columns-2 lg:gap-6 lg:*:mb-6 lg:*:break-inside-avoid lg:*:first:[column-span:all]">
        {children}
      </main>
    </div>
  );
}

interface InfoSectionProps {
  icon: Icon;
  iconClassName: string;
  title: string;
  children: ReactNode;
}

export function InfoSection({ icon: Icon, iconClassName, title, children }: InfoSectionProps) {
  return (
    <section className="rounded-2xl bg-[#071329]/80 border border-white/10 p-4 shadow-lg">
      <div className="flex items-center gap-2.5 mb-2">
        <Icon className={`w-5 h-5 shrink-0 ${iconClassName}`} />
        <h2 className="type-h4 text-white">{title}</h2>
      </div>
      <div className="type-body-sm text-neutral-300 space-y-2">{children}</div>
    </section>
  );
}
