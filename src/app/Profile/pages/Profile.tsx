import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  SignOutIcon,
  FireIcon,
  BookOpenTextIcon,
  StackIcon,
  FlagBannerIcon,
  TrophyIcon,
  ShieldCheckIcon,
  QuestionIcon,
  CaretRightIcon,
  PaletteIcon,
} from "@phosphor-icons/react";
import { cn } from "cn";
import { useAuth } from "@/app/AuthLogin/hooks/useAuth";
import { useTrail } from "@/app/Trail/hooks/useTrail";
import { StreakFlame } from "@/app/Trail/components/StreakFlame";
import { ModuleProgressList } from "@/app/Trail/components/ModuleProgressList";
import type { TrailData } from "@/app/Trail/types/types";
import { MascotHello } from "@/assets/icons";
import { MASCOT_PALETTES } from "@/assets/mascotPalettes";
import { useAvatar } from "@/lib/avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AvatarPicker } from "../components/AvatarPicker";

const TILE_CLASS =
  "rounded-2xl bg-option-dark border border-white/10 border-b-4 border-b-option-dark-border";

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { trail } = useTrail();
  const [avatar, setAvatar] = useAvatar();
  const [isPickingAvatar, setIsPickingAvatar] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const palette = MASCOT_PALETTES[avatar];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || "Investidor";
  const displayEmail = user?.email || "investidor@renvest.com.br";

  return (
    <div className="min-h-dvh w-full overflow-x-hidden select-none bg-[#000815] text-white">
      <main className="w-full max-w-md lg:max-w-5xl mx-auto px-4 lg:px-8 pt-4 lg:pt-10 pb-28 lg:pb-10 flex flex-col gap-7 lg:gap-8">
        <section
          className="relative rounded-3xl px-5 lg:px-10 pt-5 lg:pt-8 flex items-end gap-4 lg:gap-8 overflow-hidden transition-colors duration-300"
          style={{ backgroundColor: palette.deep, boxShadow: `0 5px 0 ${palette.dark}` }}
        >
          <button
            type="button"
            onClick={() => setIsPickingAvatar(true)}
            aria-label="Mudar a cor do Rev"
            className="shrink-0 h-28 sm:h-32 lg:h-44 -mb-1 cursor-pointer"
          >
            <div key={avatar} className="animate-mascot rev-wave h-full">
              <MascotHello variant={avatar} className="h-full w-auto object-contain" />
            </div>
          </button>

          <div className="flex-1 min-w-0 pb-5 lg:pb-8">
            <span className="type-overline text-white/75">Meu perfil</span>
            <h1 className="type-h1 text-white truncate mt-1">{displayName}</h1>
            <p className="type-caption text-white/75 truncate mt-0.5">{displayEmail}</p>
            <button
              type="button"
              onClick={() => setIsPickingAvatar(true)}
              className="press-3d mt-3 lg:mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border-b-4 border-black/20 type-button-sm hover:brightness-95 transition-[filter] cursor-pointer"
              style={{ color: palette.dark }}
            >
              <PaletteIcon weight="fill" className="w-4 h-4" />
              Mudar cor
            </button>
          </div>
        </section>

        <div className="flex flex-col gap-7 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-8 lg:items-start">
          <div className="flex flex-col gap-7">
            <ProfileSection title="Estatísticas">
              <StatsGrid trail={trail} />
            </ProfileSection>

            {trail && (
              <ProfileSection title="Progresso por módulo">
                <ModuleProgressList modules={trail.modules} />
              </ProfileSection>
            )}
          </div>

          <ProfileSection title="Conta">
            <div className={cn(TILE_CLASS, "overflow-hidden divide-y divide-white/5")}>
              <MenuRow
                icon={<ShieldCheckIcon weight="duotone" className="w-5 h-5 text-emerald-400" />}
                label="Privacidade e Segurança"
                onClick={() => navigate("/profile/privacidade")}
              />
              <MenuRow
                icon={<QuestionIcon weight="duotone" className="w-5 h-5 text-amber-300" />}
                label="Sobre o Renvest"
                onClick={() => navigate("/profile/sobre")}
              />
            </div>

            <button
              type="button"
              onClick={() => setIsLoggingOut(true)}
              className="press-3d mt-4 w-full py-3 rounded-xl type-button text-white bg-red border-b-4 border-red-dark shadow-lg hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/60"
            >
              <SignOutIcon weight="bold" className="w-5 h-5" />
              Sair da conta
            </button>
          </ProfileSection>
        </div>
      </main>

      <AvatarPicker
        open={isPickingAvatar}
        selected={avatar}
        onSave={setAvatar}
        onClose={() => setIsPickingAvatar(false)}
      />

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

function ProfileSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="type-overline text-white/50 mb-3">{title}</h2>
      {children}
    </section>
  );
}

function StatsGrid({ trail }: { trail?: TrailData | null }) {
  const days = trail?.streak.current_days;
  const lit = trail?.streak.active_today ?? false;
  const currentModule = trail?.modules.find((module) => module.id === trail.current_module_id);

  const streakLabel =
    days === undefined || days === 0
      ? "comece sua ofensiva hoje"
      : lit
        ? days === 1 ? "dia de ofensiva" : "dias de ofensiva"
        : "estude hoje para manter";

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatTile
        icon={
          <StreakFlame lit={lit}>
            <FireIcon
              weight={lit ? "fill" : "duotone"}
              className={cn(
                "w-7 h-7",
                lit ? "text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" : "text-neutral-500"
              )}
            />
          </StreakFlame>
        }
        value={days === undefined ? "–" : String(days)}
        label={streakLabel}
        valueClassName={lit ? "text-amber-200" : undefined}
      />
      <StatTile
        icon={<BookOpenTextIcon weight="duotone" className="w-7 h-7 text-emerald-400" />}
        value={trail ? `${trail.progress.completed_lessons}/${trail.progress.total_lessons}` : "–"}
        label="lições concluídas"
      />
      <StatTile
        icon={<StackIcon weight="duotone" className="w-7 h-7 text-sky-400" />}
        value={trail ? `${trail.progress.completed_modules}/${trail.progress.total_modules}` : "–"}
        label="módulos concluídos"
      />
      {trail?.completed ? (
        <StatTile
          icon={<TrophyIcon weight="duotone" className="w-7 h-7 text-amber-300" />}
          value="Completa"
          label="trilha concluída"
        />
      ) : (
        <StatTile
          icon={
            <FlagBannerIcon
              weight="duotone"
              className="w-7 h-7 text-red-light"
              style={currentModule ? { color: currentModule.color } : undefined}
            />
          }
          value={currentModule ? `Módulo ${currentModule.order}` : "–"}
          label={currentModule?.title ?? "módulo atual"}
        />
      )}
    </div>
  );
}

interface StatTileProps {
  icon: ReactNode;
  value: string;
  label: string;
  valueClassName?: string;
}

function StatTile({ icon, value, label, valueClassName }: StatTileProps) {
  return (
    <div className={cn(TILE_CLASS, "p-3.5 lg:p-5 flex items-center gap-3 lg:gap-4 min-w-0")}>
      <span className="shrink-0 inline-flex">{icon}</span>
      <div className="min-w-0">
        <p className={cn("type-stat text-white truncate", valueClassName)}>{value}</p>
        <p className="type-stat-label text-neutral-400 truncate mt-1">{label}</p>
      </div>
    </div>
  );
}

function MenuRow({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer text-left"
    >
      <span className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">{icon}</span>
      <span className="flex-1 font-heading font-bold type-body text-white">{label}</span>
      <CaretRightIcon className="w-4 h-4 text-white/40" />
    </button>
  );
}
