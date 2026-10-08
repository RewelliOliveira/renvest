import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useGoogleAuth } from "./useGoogleAuth";

export function useLoginForm() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login: executeGoogleLogin } = useGoogleAuth(
    async (tokenData) => {
      setIsSubmitting(true);
      setError("");
      try {
        const result = await loginWithGoogle(tokenData.access_token);
        if (result.success) {
          navigate("/home", { replace: true });
        } else {
          setError(result.error || "Erro ao autenticar com Google.");
        }
      } catch {
        setError("Erro inesperado ao conectar com o Google.");
      } finally {
        setIsSubmitting(false);
      }
    },
    () => {
      setError("Falha ou cancelamento da autenticação com o Google.");
    }
  );

  const handleGoogleLogin = () => {
    executeGoogleLogin();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Informe seu e-mail e sua senha.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/home", { replace: true });
      } else {
        setError(result.error || "Erro ao efetuar login.");
      }
    } catch {
      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
    handleGoogleLogin,
  };
}