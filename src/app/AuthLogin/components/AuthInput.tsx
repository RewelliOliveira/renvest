import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
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
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <Label
          htmlFor={id}
          className="type-label text-neutral-300"
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
          type={isPassword && isPasswordVisible ? "text" : type}
          className={cn(
            "w-full h-11 sm:h-12 bg-transparent border-none text-white placeholder:text-neutral-500 type-body focus-visible:ring-0 focus-visible:border-transparent rounded-lg",
            icon ? "pl-10" : "pl-4",
            isPassword ? "pr-11" : "pr-4",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={isPasswordVisible}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-neutral-400 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            {isPasswordVisible ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
