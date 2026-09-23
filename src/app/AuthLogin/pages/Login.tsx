import { EmailIcon, MascotIcon, LogomarcaIcon } from "@/assets/icons";
import { AuthInput, AuthButton, AuthDivider, AuthLayout } from "../components";
import { useLoginForm } from "../hooks/useLoginForm";

export function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
    handleGoogleLogin,
  } = useLoginForm();

  return (
    <AuthLayout
      mode="login"
      title="Entre na sua conta"
      navLabel="Cadastre-se"
      mobileBrand={
        <div className="flex flex-col items-center mb-5">
          <MascotIcon className="w-36 sm:w-40 h-auto drop-shadow-[0_8px_32px_rgba(240,86,86,0.2)]" />
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              Entre na
            </span>
            <LogomarcaIcon className="h-6 w-auto object-contain" />
          </div>
        </div>
      }
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full gap-3.5 pb-2"
      >
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-light text-xs font-medium">
            {error}
          </div>
        )}

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

        <div className="flex flex-col gap-1">
          <AuthInput
            id="password"
            type="password"
            label="Digite sua senha"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <AuthButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
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
