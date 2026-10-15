import { LogomarcaIcon } from "@/assets/icons";

export function TrailHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#000815]/85 backdrop-blur-md border-b border-white/10 px-4 py-3 sm:px-6">
      <div className="max-w-md mx-auto flex items-center justify-center">
        <LogomarcaIcon className="h-6 sm:h-7 w-auto object-contain drop-shadow-[0_2px_8px_rgba(240,86,86,0.3)]" />
      </div>
    </header>
  );
}
