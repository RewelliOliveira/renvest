import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useGoogleAuth } from "./useGoogleAuth";

export function useRegisterForm() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (!username.trim() || !email.trim() || !password) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas digitadas não coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register(username, email, password);
      if (result.success) {
        navigate("/home", { replace: true });
      } else {
        setError(result.error || "Erro ao cadastrar conta.");
      }
    } catch {
      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}