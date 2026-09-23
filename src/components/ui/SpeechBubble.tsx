import type { ReactNode } from "react";
import { cn } from "cn";

export interface SpeechBubbleProps {
  children: ReactNode;
  className?: string;
  direction?: "bottom" | "left";
}

export function SpeechBubble({
  children,
  className,
  direction = "bottom",
}: SpeechBubbleProps) {
  if (direction === "left") {
    return (
      <div className={cn("relative flex items-center w-full", className)}>
        <div className="relative -mr-0.5 z-10 shrink-0">
          <svg
            width="14"
            height="22"
            viewBox="0 0 14 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 1L2 11L14 21"
              fill="#040a14"
              stroke="rgba(115, 115, 115, 0.9)"
              strokeWidth="2"
            />
            <path d="M14 2L14 20" stroke="#040a14" strokeWidth="4" />
          </svg>
        </div>

        <div className="flex-1 rounded-2xl bg-[#040a14] border-2 border-neutral-600/90 px-4 py-3 sm:px-5 sm:py-3.5 shadow-2xl">
          <p className="text-white text-sm sm:text-base leading-snug font-normal text-left">
            {children}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center w-full max-w-sm sm:max-w-md",
        className
      )}
    >
      <div className="w-full rounded-2xl bg-[#040a14] border-2 border-neutral-600/90 px-5 py-4 sm:px-6 sm:py-5 shadow-2xl">
        <p className="text-white text-sm sm:text-base leading-snug sm:leading-relaxed font-normal text-left">
          {children}
        </p>
      </div>

      <div className="relative -mt-0.5 flex justify-center">
        <svg
          width="26"
          height="16"
          viewBox="0 0 26 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 0L13 14L25 0"
            fill="#040a14"
            stroke="rgba(115, 115, 115, 0.9)"
            strokeWidth="2"
          />
          <path d="M2 0L24 0" stroke="#040a14" strokeWidth="4" />
        </svg>
      </div>
    </div>
  );
}
