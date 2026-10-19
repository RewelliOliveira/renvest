import type { ReactNode } from "react";
import { motion } from "motion/react";

export function ImmersiveLayout({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-dvh max-h-dvh w-full overflow-hidden select-none bg-linear-to-b from-[#000815] via-[#00050d] to-[#000000] flex flex-col items-center px-4 sm:px-6 pt-4 sm:pt-6 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:p-0"
    >
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-none flex flex-col justify-between h-full">
        {children}
      </div>
    </motion.div>
  );
}
