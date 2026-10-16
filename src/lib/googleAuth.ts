export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || "";

// Sem Client ID o SDK do Google lança erro ao inicializar e derruba a aplicação inteira
export const isGoogleAuthEnabled = GOOGLE_CLIENT_ID !== "";
