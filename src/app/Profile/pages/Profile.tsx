import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Flame,
  Zap,
  Coins,
  ShieldCheck,
  Bell,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/app/AuthLogin/hooks/useAuth";
import { BottomNav } from "@/app/Trail/components/BottomNav";
import { MascotHello } from "@/assets/icons";

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || "Investidor";
  const displayEmail = user?.email || "investidor@renvest.com.br";

  return (
    <div className="min-h-dvh w-full overflow-x-hidden select-none bg-linear-to-b from-[#000815] via-[#00050d] to-[#000000] text-white flex flex-col justify-between">
      <header className="sticky top-0 z-30 w-full bg-[#000815]/85 backdrop-blur-md border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="max-w-md mx-auto flex items-center justify-center">
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Meu Perfil
          </h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-5 pb-28 flex flex-col gap-4">
        <div className="rounded-2xl bg-[#071329]/90 border border-white/10 p-5 flex items-center gap-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-linear-to-br from-red/30 to-sky-500/20 border border-white/15 p-1.5 flex items-center justify-center shadow-inner shrink-0">
            <MascotHello className="h-full w-auto object-contain" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red/20 border border-red/30 text-red-light">
                Nível 1 • Iniciante
              </span>
            </div>
            <h2 className="text-lg font-bold text-white truncate leading-snug">
              {displayName}
            </h2>
            <p className="text-xs text-neutral-400 truncate mt-0.5">
              {displayEmail}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col items-center text-center">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400/20 mb-1" />
            <span className="text-base font-extrabold text-white">3</span>
            <span className="text-[10px] text-neutral-400 font-medium">Dias de Ofensiva</span>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col items-center text-center">
            <Zap className="w-5 h-5 text-sky-400 fill-sky-400/20 mb-1" />
            <span className="text-base font-extrabold text-white">140</span>
            <span className="text-[10px] text-neutral-400 font-medium">Total de XP</span>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col items-center text-center">
            <Coins className="w-5 h-5 text-yellow-400 fill-yellow-400/20 mb-1" />
            <span className="text-base font-extrabold text-white">65</span>
            <span className="text-[10px] text-neutral-400 font-medium">RenCoins</span>
          </div>
        </div>

        <div className="rounded-2xl bg-[#071329]/80 border border-white/10 overflow-hidden shadow-lg divide-y divide-white/5">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-neutral-200">
                Notificações diárias
              </span>
            </div>
            <button
              type="button"
              onClick={() => setNotificationsEnabled((v) => !v)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                notificationsEnabled ? "bg-red" : "bg-neutral-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  notificationsEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() => alert("Segurança: Seus dados são salvos localmente no navegador.")}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-neutral-200">
                Privacidade e Segurança
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40" />
          </button>

          <button
            type="button"
            onClick={() => alert("Renvest: TCC de Educação Financeira com base nos dados oficiais da B3 e CVM.")}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-neutral-200">
                Sobre a Plataforma Renvest
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-white/40" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full mt-2 py-3 px-4 rounded-xl border border-red/40 bg-red/10 text-red-light font-bold text-sm hover:bg-red/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair da Conta</span>
        </button>
      </main>

      <BottomNav currentTab="profile" />
    </div>
  );
}
