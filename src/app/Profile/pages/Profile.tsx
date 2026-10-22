import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignOutIcon, FireIcon, BookOpenTextIcon, StackIcon, ShieldCheckIcon, QuestionIcon, CaretRightIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { useAuth } from "@/app/AuthLogin/hooks/useAuth";
import { useTrail } from "@/app/Trail/hooks/useTrail";
import { moduleProgress } from "@/app/Trail/utils/progress";
import { MascotHello } from "@/assets/icons";
import { useAvatar } from "@/lib/avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AvatarPicker } from "../components/AvatarPicker";

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { trail } = useTrail();
  const [avatar, setAvatar] = useAvatar();
  const [isPickingAvatar, setIsPickingAvatar] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const stat = (value?: number, total?: number) =>
    value === undefined ? "–" : total === undefined ? String(value) : `${value}/${total}`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || "Investidor";
  const displayEmail = user?.email || "investidor@renvest.com.br";

  return (
    <div className="min-h-dvh w-full overflow-x-hidden select-none bg-linear-to-b from-[#000815] via-[#00050d] to-[#000000] text-white flex flex-col justify-between">
      <header className="sticky top-0 z-30 w-full bg-[#000815]/85 backdrop-blur-md border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="max-w-md lg:max-w-5xl mx-auto flex items-center justify-center lg:justify-start lg:px-4">
          <h1 className="type-h3 text-white">
            Meu Perfil
          </h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md lg:max-w-5xl mx-auto px-4 lg:px-8 py-5 lg:py-10 pb-28 lg:pb-10 flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-6 lg:items-start">
        <div className="flex flex-col gap-4 lg:sticky lg:top-24">
          <div className="rounded-2xl bg-[#071329]/90 border border-white/10 p-5 lg:py-8 flex items-center lg:flex-col lg:text-center gap-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red/10 rounded-full blur-2xl pointer-events-none" />

            <button
              type="button"
              onClick={() => setIsPickingAvatar((v) => !v)}
              aria-label="Trocar avatar"
              aria-expanded={isPickingAvatar}
              className="relative w-16 h-16 sm:w-18 sm:h-18 lg:w-28 lg:h-28 rounded-2xl bg-linear-to-br from-red/30 to-sky-500/20 border border-white/15 p-1.5 flex items-center justify-center shadow-inner shrink-0 cursor-pointer hover:border-white/30 transition-colors"
            >
              <MascotHello variant={avatar} className="h-full w-auto object-contain" />
              <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#071329] border border-white/20 flex items-center justify-center">
                <PencilSimpleIcon className="w-3 h-3 text-white/80" />
              </span>
            </button>

            <div className="flex-1 min-w-0 lg:w-full">
              <h2 className="type-h2 text-white truncate">
                {displayName}
              </h2>
              <p className="type-caption text-neutral-400 truncate mt-0.5">
                {displayEmail}
              </p>
            </div>
          </div>

          <div className={isPickingAvatar ? undefined : "hidden lg:block"}>
            <AvatarPicker selected={avatar} onSelect={setAvatar} />
          </div>
        </div>

        <div className="flex flex-col gap-4">

          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3 lg:p-5 flex flex-col items-center text-center">
              <FireIcon weight="fill" className="w-5 h-5 text-amber-400 mb-1" />
              <span className="type-stat text-white">{stat(trail?.streak.current_days)}</span>
              <span className="type-stat-label text-neutral-400">Dias de Ofensiva</span>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-3 lg:p-5 flex flex-col items-center text-center">
              <BookOpenTextIcon className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="type-stat text-white">
                {stat(trail?.progress.completed_lessons, trail?.progress.total_lessons)}
              </span>
              <span className="type-stat-label text-neutral-400">Lições</span>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-3 lg:p-5 flex flex-col items-center text-center">
              <StackIcon className="w-5 h-5 text-sky-400 mb-1" />
              <span className="type-stat text-white">
                {stat(trail?.progress.completed_modules, trail?.progress.total_modules)}
              </span>
              <span className="type-stat-label text-neutral-400">Módulos</span>
            </div>
          </div>

          {trail && (
            <div className="hidden lg:block rounded-2xl bg-[#071329]/80 border border-white/10 p-5 shadow-lg">
              <h3 className="type-overline text-white/50 mb-4">
                Progresso por módulo
              </h3>
              <ul className="flex flex-col gap-4">
                {trail.modules.map((module) => (
                  <li key={module.id}>
                    <div className="flex items-center justify-between gap-2 mb-1.5 type-label">
                      <span className="font-heading font-bold text-white truncate">
                        {module.order}. {module.title}
                      </span>
                      <span className="type-caption tabular-nums text-neutral-400 shrink-0">
                        {Math.round(moduleProgress(module) * 100)}%
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${moduleProgress(module) * 100}%`, backgroundColor: module.color }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl bg-[#071329]/80 border border-white/10 overflow-hidden shadow-lg divide-y divide-white/5">
            <button
              type="button"
              onClick={() => navigate("/profile/privacidade")}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="type-label text-neutral-200">
                  Privacidade e Segurança
                </span>
              </div>
              <CaretRightIcon className="w-4 h-4 text-white/40" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile/sobre")}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <QuestionIcon className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="type-label text-neutral-200">
                  Sobre o Renvest
                </span>
              </div>
              <CaretRightIcon className="w-4 h-4 text-white/40" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsLoggingOut(true)}
            className="w-full mt-2 py-3 px-4 rounded-xl border border-red/40 bg-red/10 text-red-light type-button-sm hover:bg-red/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <SignOutIcon className="w-4 h-4" />
            <span>Sair da Conta</span>
          </button>
        </div>
      </main>

      <ConfirmDialog
        open={isLoggingOut}
        title="Sair da conta?"
        description="Você vai precisar entrar de novo para continuar sua trilha neste dispositivo."
        cancelLabel="Ficar"
        confirmLabel="Sair da conta"
        onCancel={() => setIsLoggingOut(false)}
        onConfirm={handleLogout}
      />

    </div>
  );
}
