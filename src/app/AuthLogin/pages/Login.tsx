import { Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StarBurst } from "@/components/ui/starsUI";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function Login() {
  return (
    <StarBurst className="min-h-screen" maxHeightPercent={48}>
      <div className="relative flex flex-col min-h-screen text-white">
        {/* ── Cabeçalho: botão "Cadastre-se" ── */}
        <header className="flex justify-end px-5 pt-5">
          <button
            type="button"
            className="relative px-1 py-0.5 text-sm font-bold text-white/90 transition-all hover:text-white"
          >
            Cadastre-se
            {/* Linha com brilho/esboço avermelhado */}
            <span className="absolute -bottom-0.5 left-0 w-full h-0.5 rounded-full bg-linear-to-r from-transparent via-red-500/80 to-transparent shadow-[0_1px_8px_rgba(239,68,68,0.65)]" />
          </button>
        </header>

        {/* ── Área do mascote e branding ── */}
        <section className="flex flex-col items-center pt-4 pb-2 px-6">
          <img
            src="/Mascot.svg"
            alt="Mascote Renvest"
            className="w-44 h-auto drop-shadow-[0_8px_32px_rgba(254,78,79,0.2)]"
            draggable={false}
          />
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-2xl font-bold tracking-tight text-white">
              Entre na
            </span>
            <img
              src="/Logomarca.svg"
              alt="renvest"
              className="h-6 w-auto object-contain"
              draggable={false}
            />
          </div>
        </section>

        {/* ── Formulário de login ── */}
        <section className="flex flex-col w-full max-w-sm mx-auto px-6 mt-6 gap-5">
          {/* Campo: E-mail */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="email"
              className="text-sm font-normal text-neutral-300"
            >
              Digite seu e-mail
            </Label>
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-lg transition-all focus-within:border-white/30 focus-within:bg-white/8">
              <Mail
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none"
                aria-hidden
              />
              <Input
                id="email"
                type="email"
                placeholder="email@dominio.com"
                autoComplete="email"
                className="w-full h-12 pl-10 pr-4 bg-transparent border-none text-white placeholder:text-neutral-500 text-sm focus-visible:ring-0 focus-visible:border-transparent rounded-lg"
              />
            </div>
          </div>

          {/* Campo: Senha */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="password"
              className="text-sm font-normal text-neutral-300"
            >
              Digite sua senha
            </Label>
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-lg transition-all focus-within:border-white/30 focus-within:bg-white/8">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none"
                aria-hidden
              />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full h-12 pl-10 pr-4 bg-transparent border-none text-white placeholder:text-neutral-400 text-sm focus-visible:ring-0 focus-visible:border-transparent rounded-lg"
              />
            </div>

            {/* Link: Esqueceu a senha */}
            <div className="flex justify-end mt-0.5">
              <button
                type="button"
                className="text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
              >
                Esqueceu sua senha?
              </button>
            </div>
          </div>

          {/* ── Botão Sign In ── */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-white text-base bg-[#F04438] border-b-4 border-[#9B1C1C] active:border-b-0 active:translate-y-0.75 transition-all shadow-lg hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
          >
            Entrar
          </button>

          {/* ── Divisor "ou" ── */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-white/10" />
            <span className="absolute bg-transparent px-3 text-xs text-neutral-500 font-medium">
              ou
            </span>
          </div>

          {/* ── Botão Google ── */}
          <button
            type="button"
            className="w-full py-3.5 rounded-xl font-bold text-white text-base bg-[#1A73E8] border-b-4 border-[#0D47A1] active:border-b-0 active:translate-y-0.75 transition-all shadow-lg hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 flex items-center justify-center gap-2.5"
          >
            <GoogleIcon className="w-5 h-5" />
            <span>Continuar com Google</span>
          </button>
        </section>

        {/* Espaço inferior para dispositivos com SafeArea */}
        <div className="pb-10" />
      </div>
    </StarBurst>
  );
}
