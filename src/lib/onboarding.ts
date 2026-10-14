const ONBOARDING_STORAGE_PREFIX = "@renvest:onboarding-done:";

export function hasCompletedOnboarding(userId: string): boolean {
  try {
    return localStorage.getItem(ONBOARDING_STORAGE_PREFIX + userId) === "true";
  } catch {
    return false;
  }
}

export function markOnboardingCompleted(userId: string): void {
  try {
    localStorage.setItem(ONBOARDING_STORAGE_PREFIX + userId, "true");
  } catch {
    // Sem storage disponível o onboarding apenas será exibido novamente
  }
}

export function getPostAuthRoute(userId?: string): string {
  return userId && hasCompletedOnboarding(userId) ? "/trail" : "/home";
}
