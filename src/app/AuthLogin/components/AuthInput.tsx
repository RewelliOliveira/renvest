import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "cn";

export interface AuthInputProps extends React.ComponentProps<typeof Input> {
  label?: string;
  icon?: React.ReactNode;
}

export function AuthInput({
  id,
  label,
  icon,
  className,
  type = "text",
  ...props
}: AuthInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <Label
          htmlFor={id}
          className="text-xs sm:text-sm font-normal text-neutral-300"
        >
          {label}
        </Label>
      )}
      <div className="relative flex items-center bg-white/5 border border-white/10 rounded-lg transition-all focus-within:border-white/30 focus-within:bg-white/8">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 flex items-center justify-center">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          className={cn(
            "w-full h-11 sm:h-12 bg-transparent border-none text-white placeholder:text-neutral-500 text-sm focus-visible:ring-0 focus-visible:border-transparent rounded-lg",
            icon ? "pl-10 pr-4" : "px-4",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}
