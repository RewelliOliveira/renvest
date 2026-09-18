import { StarBurst } from "@/components/ui/starsUI";
import { EmailIcon, MascotIcon, LogomarcaIcon } from "@/assets/icons";
import { AuthInput, AuthButton, AuthDivider } from "../components";

interface LoginProps {
  onNavigateToRegister?: () => void;
}

export function Login({ onNavigateToRegister }: LoginProps) {
  return (
    <StarBurst className="h-dvh w-full overflow-hidden" maxHeightPercent={45}>
      <div className="relative flex flex-col h-dvh justify-between text-white px-6 py-4 max-w-sm mx-auto overflow-hidden">
        <header className="flex justify-end">
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="relative px-1 py-0.5 text-sm font-bold text-white/90 transition-all hover:text-white cursor-pointer"
          >
            Cadastre-se
            <span className="absolute -bottom-0.5 left-0 w-full h-0.5 rounded-full bg-linear-to-r from-transparent via-red-light/80 to-transparent shadow-[0_1px_8px_rgba(254,120,113,0.65)]" />
          </button>
        </header>

        <section className="flex flex-col items-center">
          <MascotIcon className="w-36 sm:w-40 h-auto drop-shadow-[0_8px_32px_rgba(240,86,86,0.2)]" />
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              Entre na
            </span>
            <LogomarcaIcon className="h-6 w-auto object-contain" />
          </div>
        </section>

        <section className="flex flex-col w-full gap-3.5 pb-2">
          <AuthInput
            id="email"
            type="email"
            label="Digite seu e-mail"
            placeholder="email@dominio.com"
            autoComplete="email"
            icon={<EmailIcon className="w-4.5 h-4.5" />}
          />

          <div className="flex flex-col gap-1">
            <AuthInput
              id="password"
              type="password"
              label="Digite sua senha"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <div className="flex justify-end mt-0.5">
              <button
                type="button"
                className="text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                Esqueceu sua senha?
              </button>
            </div>
          </div>

          <AuthButton type="submit">Entrar</AuthButton>

          <AuthDivider />

          <AuthButton variant="google">Continuar com Google</AuthButton>
        </section>
      </div>
    </StarBurst>
  );
}
