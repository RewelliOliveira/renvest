import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaretLeftIcon } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "cn";
import { MascotHello, MascotPoint, MascotPlan } from "@/assets/icons";
import { Progress } from "@/components/ui/progress";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { useAuth } from "@/app/AuthLogin/hooks/useAuth";
import { markOnboardingCompleted } from "@/lib/onboarding";
import { useQuizKeyboard } from "@/lib/useQuizKeyboard";
import { ImmersiveFooter } from "@/components/layout/ImmersiveFooter";
import { getOnboardingSteps, type OnboardingStepData } from "../services/onboardingApi";

const MASCOTS = { MascotHello, MascotPoint, MascotPlan };

// Usado enquanto o conteúdo da API (/api/steps) carrega ou se ela estiver indisponível
const FALLBACK_STEPS: OnboardingStepData[] = [
  { id: 1, text: "Olá! Eu sou o Rev, seu assistente de educação financeira para investidores iniciantes.", mascot: "MascotHello" },
  { id: 2, text: "Aqui, você aprende, pratica e evolui para tomar decisões financeiras com mais confiança.", mascot: "MascotPoint" },
  { id: 3, text: "Vamos dar início com os conceitos iniciais sobre investimentos!", mascot: "MascotPlan" },
];

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [steps, setSteps] = useState<OnboardingStepData[]>(FALLBACK_STEPS);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    let isMounted = true;
    getOnboardingSteps()
      .then((data) => {
        if (isMounted && data.length > 0) setSteps(data);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      if (user) markOnboardingCompleted(user.id);
      navigate("/trail");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  useQuizKeyboard({ optionCount: 0, onEnter: handleNext });

  const activeStep = steps[Math.min(currentStep, steps.length) - 1];
  const MascotComponent = MASCOTS[activeStep.mascot as keyof typeof MASCOTS] ?? MascotHello;

  return (
    <div className="h-dvh max-h-dvh w-full overflow-hidden select-none bg-linear-to-b from-[#000815] via-[#00050d] to-[#000000] flex flex-col justify-between items-center px-6 pt-5 sm:pt-8 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-[max(2rem,env(safe-area-inset-bottom))] lg:p-0">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-none flex flex-col justify-between h-full">
        <header className="w-full flex items-center gap-3 pt-1 pb-3 lg:max-w-5xl lg:mx-auto lg:px-10 lg:pt-8 lg:pb-6 lg:gap-5">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            aria-label="Voltar etapa"
            className={cn(
              "text-white/80 hover:text-white transition-opacity p-1 -ml-1 cursor-pointer",
              currentStep === 1 ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
          >
            <CaretLeftIcon className="w-6 h-6" />
          </button>
          <Progress
            value={(currentStep / steps.length) * 100}
            className="flex-1"
          />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center w-full my-auto min-h-0 py-2 lg:px-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentStep}`}
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="w-full flex flex-col items-center justify-center lg:max-w-5xl lg:flex-row-reverse lg:gap-12"
            >
              <SpeechBubble direction="auto">
                {activeStep.text}
              </SpeechBubble>

              <div className="mt-4 sm:mt-6 lg:mt-0 flex items-center justify-center h-48 sm:h-56 lg:h-80 w-full lg:w-auto lg:shrink-0">
                <motion.div
                  animate={
                    MascotComponent === MascotHello
                      ? { y: 0, rotate: 0, scale: 1 }
                      : currentStep === 1
                      ? { y: [0, -6, 0] }
                      : currentStep === 2
                      ? { y: [0, -7, 0], rotate: [0, -1.2, 1, 0] }
                      : { y: [0, -5, 0], scale: [1, 1.015, 1] }
                  }
                  transition={{
                    repeat: Infinity,
                    duration: currentStep === 1 ? 2.4 : currentStep === 2 ? 2.8 : 3.2,
                    ease: "easeInOut",
                  }}
                  className="rev-wave h-full flex items-center justify-center"
                >
                  <MascotComponent className="h-full w-auto max-w-55 lg:max-w-80 object-contain drop-shadow-[0_12px_32px_rgba(240,86,86,0.22)]" />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        <ImmersiveFooter className="pt-3 pb-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 sm:py-4 rounded-xl type-button text-white bg-red border-b-4 border-red-dark press-3d transition-all shadow-lg hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/60 cursor-pointer"
          >
            Continuar
          </motion.button>
        </ImmersiveFooter>
      </div>
    </div>
  );
}
