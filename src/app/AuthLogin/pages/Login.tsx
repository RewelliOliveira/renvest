import { EnvelopeSimpleIcon } from "@phosphor-icons/react";
import { MascotIcon, LogomarcaIcon } from "@/assets/icons";
import { MascotLoader } from "@/components/ui/MascotLoader";
import { isGoogleAuthEnabled } from "@/lib/googleAuth";
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
            <span className="type-h1 text-white">
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
          <div role="alert" className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-light type-caption">
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
          icon={<EnvelopeSimpleIcon className="w-4.5 h-4.5 text-[#787878]" />}
        />

        <AuthInput
          id="password"
          type="password"
          label="Digite sua senha"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthButton type="submit" disabled={isSubmitting}>
          Entrar
        </AuthButton>

        {isGoogleAuthEnabled && (
          <>
            <AuthDivider />

            <AuthButton
              variant="google"
              onClick={handleGoogleLogin}
            >
              Continuar com Google
            </AuthButton>
          </>
        )}
      </form>

      {isSubmitting && <MascotLoader title="Entrando" portal />}
    </AuthLayout>
  );
}
