import { CaretLeftIcon, XIcon } from "@phosphor-icons/react";
import { Progress } from "@/components/ui/progress";

interface MissionHeaderProps {
  progressValue: number;
  onBack: () => void;
  onClose?: () => void;
}

export function MissionHeader({
  progressValue,
  onBack,
  onClose,
}: MissionHeaderProps) {
  return (
    <header className="w-full flex items-center gap-3 pt-1 pb-3 shrink-0 lg:max-w-5xl lg:mx-auto lg:px-10 lg:pt-8 lg:pb-6 lg:gap-5">
      <button
        type="button"
        onClick={onBack}
        aria-label="Voltar"
        className="text-white/80 hover:text-white transition-opacity p-1 -ml-1 cursor-pointer"
      >
        <CaretLeftIcon className="w-6 h-6" />
      </button>

      <Progress value={progressValue} className="flex-1" />

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Sair"
          className="text-white/60 hover:text-white transition-colors p-1 -mr-1 cursor-pointer"
        >
          <XIcon className="w-6 h-6" />
        </button>
      )}
    </header>
  );
}
