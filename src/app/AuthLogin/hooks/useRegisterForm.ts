import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useGoogleSignIn } from "./useGoogleAuth";
import { validateName } from "@/lib/nameValidation";

const MIN_PASSWORD_LENGTH = 6;

export function useRegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = useGoogleSignIn({ setError, setIsSubmitting });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !password) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const nameError = validateName(username);
    if (nameError) {
      setError(nameError);
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`);
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
        // Conta nova sempre passa pelo onboarding
        navigate("/home", { replace: true });
      } else {
        setError(result.error || "Erro ao cadastrar conta.");
      }
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
    handleGoogleLogin: () => handleGoogleLogin(),
  };
}
