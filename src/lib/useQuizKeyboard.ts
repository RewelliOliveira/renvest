import { useEffect, useEffectEvent } from "react";

interface QuizKeyboardOptions {
  optionCount: number;
  onSelect?: (index: number) => void;
  onEnter?: () => void;
  enabled?: boolean;
}

export function useQuizKeyboard({ optionCount, onSelect, onEnter, enabled = true }: QuizKeyboardOptions) {
  const select = useEffectEvent((index: number) => onSelect?.(index));
  const enter = useEffectEvent(() => onEnter?.());

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;

      const digit = Number(event.key);
      if (Number.isInteger(digit) && digit >= 1 && digit <= optionCount) {
        event.preventDefault();
        select(digit - 1);
      } else if (event.key === "Enter") {
        event.preventDefault();
        enter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, optionCount]);
}
