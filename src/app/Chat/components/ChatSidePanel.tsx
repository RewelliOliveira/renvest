import { ExternalLink, MessageCircleQuestion, ShieldCheck } from "lucide-react";
import { SidePanel, PanelCard } from "@/components/layout/SidePanel";
import type { ChatSource } from "../types/types";

interface ChatSidePanelProps {
  suggestions: string[];
  sources: ChatSource[];
  disabled: boolean;
  onSelectSuggestion: (text: string) => void;
}

export function ChatSidePanel({ suggestions, sources, disabled, onSelectSuggestion }: ChatSidePanelProps) {
  return (
    <SidePanel>
      <PanelCard title="Sugestões de perguntas">
        {suggestions.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {suggestions.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelectSuggestion(item)}
                  className="w-full flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-white/85 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <MessageCircleQuestion className="w-4 h-4 mt-0.5 shrink-0 text-sky-400" />
                  <span className="leading-snug">{item}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-neutral-400">As sugestões aparecem conforme a conversa avança.</p>
        )}
      </PanelCard>

      <PanelCard title="Fontes consultadas">
        {sources.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {sources.map((source) => (
              <li key={`${source.document}-${source.section}`} className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-sky-400" />
                <div className="min-w-0 text-xs leading-snug">
                  <p className="font-semibold text-white">{source.document}</p>
                  <p className="text-neutral-400">
                    {source.institution ? `${source.institution} • ` : ""}
                    {source.section}
                  </p>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-sky-300 hover:text-sky-200 hover:underline"
                    >
                      Abrir documento
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-neutral-400">
            Os documentos oficiais usados nas respostas do Rev aparecem aqui.
          </p>
        )}
      </PanelCard>
    </SidePanel>
  );
}
