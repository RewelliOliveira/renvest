import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StarBurst } from "@/components/ui/starsUI";
import {
  UserIcon,
  EmailIcon,
  GoogleIcon,
  LogomarcaIcon,
} from "@/assets/icons";

interface RegisterProps {
  onNavigateToLogin?: () => void;
}

export function Register({ onNavigateToLogin }: RegisterProps) {
  return (
    <StarBurst className="h-dvh w-full overflow-hidden" maxHeightPercent={45}>
      <div className="relative flex flex-col h-dvh justify-between text-white px-6 py-4 max-w-sm mx-auto overflow-hidden">
        <header className="flex justify-end">
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="relative px-1 py-0.5 text-sm font-bold text-white/90 transition-all hover:text-white cursor-pointer"
          >
            Entrar
            <span className="absolute -bottom-0.5 left-0 w-full h-0.5 rounded-full bg-linear-to-r from-transparent via-red-light/80 to-transparent shadow-[0_1px_8px_rgba(254,120,113,0.65)]" />
          </button>
        </header>

        <section className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Cadastre-se na
            </span>
            <LogomarcaIcon className="h-5 sm:h-6 w-auto object-contain" />
          </div>
        </section>

        <section className="flex flex-col w-full gap-2.5 pb-2">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="username"
              className="text-xs sm:text-sm font-normal text-neutral-300"
            >
              Digite seu usuário
            </Label>
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-lg transition-all focus-within:border-white/30 focus-within:bg-white/8">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none text-neutral-400" />
              <Input
                id="username"
                type="text"
                placeholder="Seu nome de usuário"
                autoComplete="username"
                className="w-full h-11 pl-10 pr-4 bg-transparent border-none text-white placeholder:text-neutral-500 text-sm focus-visible:ring-0 focus-visible:border-transparent rounded-lg"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label
              htmlFor="email"
              className="text-xs sm:text-sm font-normal text-neutral-300"
            >
              Digite seu e-mail
            </Label>
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-lg transition-all focus-within:border-white/30 focus-within:bg-white/8">
              <EmailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none text-neutral-400" />
              <Input
                id="email"
                type="email"
                placeholder="email@dominio.com"
                autoComplete="email"
                className="w-full h-11 pl-10 pr-4 bg-transparent border-none text-white placeholder:text-neutral-500 text-sm focus-visible:ring-0 focus-visible:border-transparent rounded-lg"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label
              htmlFor="password"
              className="text-xs sm:text-sm font-normal text-neutral-300"
            >
              Digite sua senha
            </Label>
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-lg transition-all focus-within:border-white/30 focus-within:bg-white/8">
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full h-11 px-4 bg-transparent border-none text-white placeholder:text-neutral-400 text-sm focus-visible:ring-0 focus-visible:border-transparent rounded-lg"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label
              htmlFor="confirmPassword"
              className="text-xs sm:text-sm font-normal text-neutral-300"
            >
              Confirme sua senha
            </Label>
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-lg transition-all focus-within:border-white/30 focus-within:bg-white/8">
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full h-11 px-4 bg-transparent border-none text-white placeholder:text-neutral-400 text-sm focus-visible:ring-0 focus-visible:border-transparent rounded-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-white text-base bg-red border-b-2 border-red-dark active:border-b-0 active:translate-y-0.5 transition-all shadow-lg hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/60 cursor-pointer mt-0.5"
          >
            Cadastrar
          </button>

          <div className="relative flex items-center justify-center my-0.5">
            <div className="w-full border-t border-white/10" />
            <span className="absolute bg-transparent px-3 text-xs text-neutral-500 font-medium">
              ou
            </span>
          </div>

          <button
            type="button"
            className="w-full py-3 rounded-xl font-bold text-white text-base bg-blue border-b-2 border-blue-dark active:border-b-0 active:translate-y-0.5 transition-all shadow-lg hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/60 flex items-center justify-center gap-2 cursor-pointer"
          >
            <GoogleIcon className="w-5 h-5" />
            <span>Continuar com Google</span>
          </button>
        </section>
      </div>
    </StarBurst>
  );
}
