import { useLayoutEffect, useRef } from "react";
import type { KeyboardEvent, TextareaHTMLAttributes } from "react";
import { cn } from "cn";

interface AutoGrowTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
}

// Cresce com o texto até o max-height da classe; acima disso rola por dentro.
// Enter envia, Shift+Enter quebra linha.
export function AutoGrowTextarea({ value, onValueChange, onSubmit, className, ...props }: AutoGrowTextareaProps) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "block resize-none max-h-32 overflow-y-auto wrap-break-word select-text leading-relaxed",
        className
      )}
      {...props}
    />
  );
}
