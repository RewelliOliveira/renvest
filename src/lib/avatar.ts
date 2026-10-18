import { MASCOT_PALETTES, type MascotVariant } from "@/assets/mascotPalettes";

const AVATAR_STORAGE_PREFIX = "@renvest:avatar:";

export const DEFAULT_AVATAR: MascotVariant = "red";

function isMascotVariant(value: string | null): value is MascotVariant {
  return value !== null && value in MASCOT_PALETTES;
}

export function getSavedAvatar(userId?: string): MascotVariant {
  if (!userId) return DEFAULT_AVATAR;
  try {
    const saved = localStorage.getItem(AVATAR_STORAGE_PREFIX + userId);
    return isMascotVariant(saved) ? saved : DEFAULT_AVATAR;
  } catch {
    return DEFAULT_AVATAR;
  }
}

export function saveAvatar(userId: string, variant: MascotVariant): void {
  try {
    localStorage.setItem(AVATAR_STORAGE_PREFIX + userId, variant);
  } catch {
    // Sem storage disponível o avatar volta ao padrão no próximo acesso
  }
}
