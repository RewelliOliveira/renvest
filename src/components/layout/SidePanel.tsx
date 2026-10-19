import type { ReactNode } from "react";
import { cn } from "cn";

export function SidePanel({ children }: { children: ReactNode }) {
  return (
    <aside className="hidden xl:flex sticky top-0 h-dvh w-80 shrink-0 flex-col gap-4 overflow-y-auto py-8 pr-8">
      {children}
    </aside>
  );
}

interface PanelCardProps {
  title?: string;
  className?: string;
  children: ReactNode;
}

export function PanelCard({ title, className, children }: PanelCardProps) {
  return (
    <section className={cn("rounded-2xl bg-[#071329]/80 border border-white/10 p-5 shadow-lg", className)}>
      {title && (
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-white/50 mb-4">{title}</h2>
      )}
      {children}
    </section>
  );
}
