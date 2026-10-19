import { useCallback, useSyncExternalStore } from "react";
import { MASCOT_PALETTES, type MascotVariant } from "@/assets/mascotPalettes";
import { useAuth } from "@/app/AuthLogin/hooks/useAuth";

const AVATAR_STORAGE_PREFIX = "@renvest:avatar:";
const AVATAR_CHANGE_EVENT = "renvest:avatar-change";

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
  window.dispatchEvent(new Event(AVATAR_CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(AVATAR_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(AVATAR_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// Avatar do usuário logado, sincronizado entre todas as telas montadas
export function useAvatar() {
  const { user } = useAuth();
  const userId = user?.id;
  const avatar = useSyncExternalStore(subscribe, () => getSavedAvatar(userId));
  const setAvatar = useCallback(
    (variant: MascotVariant) => {
      if (userId) saveAvatar(userId, variant);
    },
    [userId]
  );
  return [avatar, setAvatar] as const;
}
