import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { getPostAuthRoute } from "@/lib/onboarding";
import { useAuth } from "./useAuth";

interface UseGoogleSignInParams {
  setError: (message: string) => void;
  setIsSubmitting: (value: boolean) => void;
}

/** Fluxo de login com Google compartilhado pelas telas de login e cadastro. */
export function useGoogleSignIn({ setError, setIsSubmitting }: UseGoogleSignInParams) {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  return useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsSubmitting(true);
      setError("");
      try {
        const result = await loginWithGoogle(tokenResponse.access_token);
        if (result.success) {
          navigate(getPostAuthRoute(result.user?.id), { replace: true });
        } else {
          setError(result.error || "Erro ao autenticar com Google.");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    onError: () => {
      setError("Falha ou cancelamento da autenticação com o Google.");
    },
  });
}
