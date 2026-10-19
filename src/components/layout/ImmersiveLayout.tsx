import type { ReactNode } from "react";

export function ImmersiveLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-dvh max-h-dvh w-full overflow-hidden select-none bg-linear-to-b from-[#000815] via-[#00050d] to-[#000000] flex flex-col items-center px-4 sm:px-6 py-4 sm:py-6 lg:p-0">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-none flex flex-col justify-between h-full">
        {children}
      </div>
    </div>
  );
}
