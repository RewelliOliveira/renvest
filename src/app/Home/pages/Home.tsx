import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "cn";
import { MascotHello, MascotPoint, MascotPlan } from "@/assets/icons";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SpeechBubble } from "@/components/ui/SpeechBubble";

const STEPS = [
  {
    text: "Olá! Eu sou o Rev, Seu assistente de educação financeira para investidores iniciantes.",
    mascot: MascotHello,
  },
  {
    text: "Aqui, você aprende, pratica e evolui para tomar decisöes financeiras com mais confiança.",
    mascot: MascotPoint,
  },
  {
    text: "Vamos dar inicio com os conceitos iniciai sobre investimentos!",
    mascot: MascotPlan,
  },
];

export function Home() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const activeStep = STEPS[currentStep - 1];
  const MascotComponent = activeStep.mascot;

  return (
    <div className="h-dvh max-h-dvh w-full overflow-hidden select-none bg-linear-to-b from-[#000815] via-[#00050d] to-[#000000] flex flex-col justify-between items-center px-6 py-5 sm:py-8">
      <div className="w-full max-w-sm sm:max-w-md flex flex-col justify-between h-full">
        <header className="w-full flex items-center gap-3 pt-1 pb-3">
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
            <ChevronLeft className="w-6 h-6" />
          </button>
          <ProgressBar
            currentStep={currentStep}
            totalSteps={STEPS.length}
            className="flex-1"
          />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center w-full my-auto min-h-0 py-2">
          <SpeechBubble key={`speech-${currentStep}`} className="animate-bubble">
            {activeStep.text}
          </SpeechBubble>

          <div
            key={`mascot-wrap-${currentStep}`}
            className="mt-4 sm:mt-6 flex items-center justify-center h-48 sm:h-56 w-full animate-mascot"
          >
            <MascotComponent className="h-full w-auto max-w-55 object-contain drop-shadow-[0_12px_32px_rgba(240,86,86,0.22)]" />
          </div>
        </main>

        <footer className="w-full pt-3 pb-2">
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 sm:py-4 rounded-xl font-bold text-white text-base bg-red border-b-4 border-red-dark active:border-b-0 active:translate-y-0.5 transition-all shadow-lg hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/60 cursor-pointer"
          >
            Continuar
          </button>
        </footer>
      </div>
    </div>
  );
}
