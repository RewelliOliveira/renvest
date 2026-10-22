import { useEffect, useState } from "react";

const MS_PER_CHAR = 28;
const MAX_DURATION_MS = 2500;

export interface TypewriterTextProps {
  text: string;
  animate?: boolean;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Quantos caracteres de um texto de tamanho `total` já devem estar visíveis
export function useTypewriterCount(total: number, animate = true) {
  const [count, setCount] = useState(() => (!animate || prefersReducedMotion() ? total : 0));

  useEffect(() => {
    if (count >= total) return;

    // Textos longos aceleram para não passar do tempo máximo
    const msPerChar = Math.min(MS_PER_CHAR, MAX_DURATION_MS / total);
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const next = Math.min(total, Math.floor((now - start) / msPerChar) + 1);
      setCount(next);
      if (next < total) frame = requestAnimationFrame(tick);
    });

    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return count;
}

function TypewriterRun({ text }: { text: string }) {
  const chars = Array.from(text);
  const count = useTypewriterCount(chars.length);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars.slice(0, count).join("")}
        {/* O restante invisível reserva o espaço final e evita o balão "crescer" */}
        <span className="invisible">{chars.slice(count).join("")}</span>
      </span>
    </>
  );
}

export function TypewriterText({ text, animate = true }: TypewriterTextProps) {
  if (!animate) return <>{text}</>;
  return <TypewriterRun key={text} text={text} />;
}
