import { useState } from "react";
import { ArrowSquareOutIcon, CaretDownIcon, ShieldCheckIcon } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "cn";
import type { ChatSource } from "../types/types";

function sourceKey(source: ChatSource) {
  return `${source.document}-${source.section}`;
}

interface SourceSealsProps {
  sources: ChatSource[];
}

// Selos clicáveis com as fontes oficiais usadas na resposta
export function SourceSeals({ sources }: SourceSealsProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const openSource = sources.find((source) => sourceKey(source) === openKey);

  return (
    <div className="mt-1 pt-2 border-t border-white/10 flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {sources.map((source) => {
          const key = sourceKey(source);
          const isOpen = key === openKey;

          return (
            <button
              key={key}
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenKey(isOpen ? null : key)}
              className={cn(
                "inline-flex items-center gap-1 max-w-full rounded-full border px-2 py-0.5 type-micro font-semibold transition-colors cursor-pointer",
                isOpen
                  ? "bg-sky-400/20 border-sky-400/60 text-sky-200"
                  : "bg-sky-400/10 border-sky-400/30 text-sky-300 hover:bg-sky-400/15"
              )}
            >
              <ShieldCheckIcon weight="fill" className="w-3 h-3 shrink-0" />
              <span className="truncate">{source.institution ?? source.document}</span>
              <CaretDownIcon className={cn("w-2.5 h-2.5 shrink-0 transition-transform", isOpen && "rotate-180")} />
            </button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {openSource && (
          <motion.div
            key={openKey}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 type-caption">
              <p className="font-semibold text-white">{openSource.document}</p>
              <p className="text-neutral-400">{openSource.section}</p>
              {openSource.url && (
                <a
                  href={openSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-sky-300 hover:text-sky-200 hover:underline"
                >
                  Abrir documento oficial
                  <ArrowSquareOutIcon className="w-3 h-3" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
