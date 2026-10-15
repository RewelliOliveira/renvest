import { apiRequest } from "@/lib/api";

export interface OnboardingStepData {
  id: number;
  text: string;
  mascot: string;
}

export function getOnboardingSteps(): Promise<OnboardingStepData[]> {
  return apiRequest("/steps", {
    method: "GET",
    fallbackError: "Não foi possível carregar o onboarding.",
  });
}
