import { cn } from "cn";

interface AuthDividerProps {
  text?: string;
  className?: string;
}

export function AuthDivider({ text = "ou", className }: AuthDividerProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center my-0.5",
        className
      )}
    >
      <div className="w-full border-t border-white/10" />
      <span className="absolute bg-transparent px-3 text-xs text-neutral-500 font-medium">
        {text}
      </span>
    </div>
  );
}
