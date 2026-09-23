import { UserIcon, EmailIcon, LogomarcaIcon } from "@/assets/icons";
import { AuthInput, AuthButton, AuthDivider, AuthLayout } from "../components";
import { useRegisterForm } from "../hooks/useRegisterForm";

export function Register() {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isSubmitting,
    handleSubmit,
    handleGoogleLogin,
  } = useRegisterForm();

  return (
    <AuthLayout
      mode="register"
      title="Crie sua conta"
      navLabel="Entrar"
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
        onSubmit={handleSubmit}
        className="flex flex-col w-full gap-2.5 sm:gap-3 pb-2"
      >
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-light text-xs font-medium">
            {error}
          </div>
        )}

        <AuthInput
          id="username"
          type="text"
          label="Digite seu usuário"
          placeholder="Seu nome de usuário"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          icon={<UserIcon className="w-4.5 h-4.5" />}
        />

        <AuthInput
          id="email"
          type="email"
          label="Digite seu e-mail"
          placeholder="email@dominio.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<EmailIcon className="w-4.5 h-4.5" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <AuthInput
            id="password"
            type="password"
            label="Digite sua senha"
            placeholder="••••••••"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <AuthInput
            id="confirmPassword"
            type="password"
            label="Confirme sua senha"
            placeholder="••••••••"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <AuthButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </AuthButton>

        <AuthDivider />

        <AuthButton
          variant="google"
          onClick={handleGoogleLogin}
        >
          Continuar com Google
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
