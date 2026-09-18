import * as React from "react";
import { cn } from "cn";
import { GoogleIcon } from "@/assets/icons";

export interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "google";
  children?: React.ReactNode;
}

export function AuthButton({
  variant = "primary",
  children,
  className,
  type,
  ...props
}: AuthButtonProps) {
  if (variant === "google") {
    return (
      <button
        type={type || "button"}
        className={cn(
          "w-full py-3 sm:py-3.5 rounded-xl font-bold text-white text-base bg-blue border-b-2 border-blue-dark active:border-b-0 active:translate-y-0.5 transition-all shadow-lg hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/60 flex items-center justify-center gap-2.5 cursor-pointer",
          className
        )}
        {...props}
      >
        <GoogleIcon className="w-5 h-5" />
        <span>{children || "Continuar com Google"}</span>
      </button>
    );
  }

  return (
    <button
      type={type || "submit"}
      className={cn(
        "w-full py-3 sm:py-3.5 rounded-xl font-bold text-white text-base bg-red border-b-2 border-red-dark active:border-b-0 active:translate-y-0.5 transition-all shadow-lg hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/60 cursor-pointer mt-0.5",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
