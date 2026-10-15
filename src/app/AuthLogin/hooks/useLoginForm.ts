import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getPostAuthRoute } from "@/lib/onboarding";
import { useAuth } from "./useAuth";
import { useGoogleSignIn } from "./useGoogleAuth";

export function useLoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = useGoogleSignIn({ setError, setIsSubmitting });

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
        navigate(getPostAuthRoute(result.user?.id), { replace: true });
      } else {
        setError(result.error || "Erro ao efetuar login.");
      }
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
    handleGoogleLogin: () => handleGoogleLogin(),
  };
}
