import type { ReactNode } from "react";
import { cn } from "cn";

interface ImmersiveFooterProps {
  tone?: "success" | "error" | null;
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function ImmersiveFooter({ tone, aside, className = "pt-2 pb-1", children }: ImmersiveFooterProps) {
  return (
    <footer
      className={cn(
        "w-full shrink-0 lg:py-6 lg:border-t-2 lg:transition-colors lg:duration-300",
        tone === "success"
          ? "lg:bg-emerald-500/10 lg:border-emerald-500/30"
          : tone === "error"
            ? "lg:bg-red/10 lg:border-red/30"
            : "lg:border-white/10",
        className
      )}
    >
      <div className="flex flex-col gap-2.5 lg:max-w-5xl lg:mx-auto lg:px-10 lg:flex-row lg:items-center lg:gap-8">
        {aside && <div className="lg:flex-1 lg:min-w-0 lg:max-w-2xl">{aside}</div>}
        <div className="lg:w-64 lg:shrink-0 lg:ml-auto">{children}</div>
      </div>
    </footer>
  );
}
