import { useGoogleLogin } from "@react-oauth/google";

export interface GoogleAuthResponse {
  access_token: string;
}

export function useGoogleAuth(
  onSuccessCallback?: (data: GoogleAuthResponse) => void,
  onErrorCallback?: (error: unknown) => void
) {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      if (onSuccessCallback) {
        onSuccessCallback({ access_token: tokenResponse.access_token });
      }
    },
    onError: (error) => {
      console.error("Falha na autenticação do Google:", error);
      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
  });

  return { login };
}