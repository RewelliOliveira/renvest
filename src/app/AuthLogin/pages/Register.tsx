import { Lock } from "lucide-react";
import { UserIcon, EmailIcon, LogomarcaIcon } from "@/assets/icons";
import { AuthInput, AuthButton, AuthDivider, AuthLayout } from "../components";

interface RegisterProps {
  onNavigateToLogin?: () => void;
}

export function Register({ onNavigateToLogin }: RegisterProps) {
  return (
    <AuthLayout
      mode="register"
      title="Crie sua conta"
      navLabel="Entrar"
      onNavigate={onNavigateToLogin}
      mobileBrand={
        <div className="flex flex-col items-center mb-4 sm:mb-5">
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Cadastre-se na
            </span>
            <LogomarcaIcon className="h-5 sm:h-6 w-auto object-contain" />
          </div>
        </div>
      }
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col w-full gap-2.5 sm:gap-3 pb-2"
      >
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <AuthInput
            id="password"
            type="password"
            label="Digite sua senha"
            placeholder="••••••••"
            autoComplete="new-password"
            icon={<Lock className="w-4.5 h-4.5" />}
          />

          <AuthInput
            id="confirmPassword"
            type="password"
            label="Confirme sua senha"
            placeholder="••••••••"
            autoComplete="new-password"
            icon={<Lock className="w-4.5 h-4.5" />}
          />
        </div>

        <AuthButton type="submit">Cadastrar</AuthButton>

        <AuthDivider />

        <AuthButton variant="google">Continuar com Google</AuthButton>
      </form>
    </AuthLayout>
  );
}
