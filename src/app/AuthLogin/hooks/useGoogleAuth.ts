import { useGoogleLogin } from "@react-oauth/google";

export interface GoogleUserProfile {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified?: boolean;
}

const googleUserInfoUrl =
  import.meta.env.VITE_GOOGLE_USERINFO_URL;

export function useGoogleAuth(onSuccessCallback?: (user: GoogleUserProfile) => void) {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch(googleUserInfoUrl, {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const user: GoogleUserProfile = await response.json();
        if (onSuccessCallback) {
          onSuccessCallback(user);
        }
      } catch (error) {
        console.error("Erro ao autenticar com Google:", error);
      }
    },
    onError: (error) => {
      console.error("Falha na autenticação do Google:", error);
    },
  });

  return { login };
}
