import { StarBurst } from "@/components/ui/starsUI";
import { UserIcon, EmailIcon, LogomarcaIcon } from "@/assets/icons";
import { AuthInput, AuthButton, AuthDivider } from "../components";

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
          <AuthInput
            id="username"
            type="text"
            label="Digite seu usuário"
            placeholder="Seu nome de usuário"
            autoComplete="username"
            icon={<UserIcon className="w-4.5 h-4.5" />}
          />

          <AuthInput
            id="email"
            type="email"
            label="Digite seu e-mail"
            placeholder="email@dominio.com"
            autoComplete="email"
            icon={<EmailIcon className="w-4.5 h-4.5" />}
          />

          <AuthInput
            id="password"
            type="password"
            label="Digite sua senha"
            placeholder="••••••••"
            autoComplete="new-password"
          />

          <AuthInput
            id="confirmPassword"
            type="password"
            label="Confirme sua senha"
            placeholder="••••••••"
            autoComplete="new-password"
          />

          <AuthButton type="submit">Cadastrar</AuthButton>

          <AuthDivider />

          <AuthButton variant="google">Continuar com Google</AuthButton>
        </section>
      </div>
    </StarBurst>
  );
}
