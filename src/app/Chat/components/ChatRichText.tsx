import { useMemo } from "react";
import { cn } from "cn";
import { useTypewriterCount } from "@/components/ui/TypewriterText";

type InlineKind = "text" | "bold" | "number";

interface Inline {
  kind: InlineKind;
  text: string;
  start: number;
}

interface Block {
  marker?: string;
  inlines: Inline[];
}

const LIST_ITEM = /^\s*([-*•]|\d+[.)])\s+/;
const BOLD = /(\*\*[^*]+\*\*)/g;
// Valores em reais e percentuais ganham destaque
const NUMBER = /(R\$\s?\d[\d.,]*(?:\s?(?:mil|milhão|milhões|bi|bilhão|bilhões))?|\d+(?:[.,]\d+)?\s?%)/g;

const INLINE_CLASS: Record<InlineKind, string | undefined> = {
  text: undefined,
  bold: "font-bold text-white",
  number: "font-bold text-sky-300 tabular-nums",
};

function parseBlocks(text: string): { blocks: Block[]; total: number } {
  let offset = 0;

  const pushInline = (inlines: Inline[], kind: InlineKind, piece: string) => {
    inlines.push({ kind, text: piece, start: offset });
    offset += Array.from(piece).length;
  };

  const blocks = text
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      const listMatch = line.match(LIST_ITEM);
      const marker = listMatch ? (/\d/.test(listMatch[1]) ? listMatch[1] : "•") : undefined;
      const content = listMatch ? line.slice(listMatch[0].length) : line;

      const inlines: Inline[] = [];
      for (const part of content.split(BOLD)) {
        if (!part) continue;
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          pushInline(inlines, "bold", part.slice(2, -2));
          continue;
        }
        part.split(NUMBER).forEach((piece, index) => {
          if (piece) pushInline(inlines, index % 2 ? "number" : "text", piece);
        });
      }
      return { marker, inlines };
    });

  return { blocks, total: offset };
}

interface ChatRichTextProps {
  text: string;
  animate: boolean;
}

// Formatação leve (negrito, listas e valores) com efeito de digitação
export function ChatRichText({ text, animate }: ChatRichTextProps) {
  const { blocks, total } = useMemo(() => parseBlocks(text), [text]);
  const count = useTypewriterCount(total, animate);
  const isTyping = count < total;

  const renderInline = (inline: Inline, key: number) => {
    const chars = Array.from(inline.text);
    const shown = Math.max(0, Math.min(chars.length, count - inline.start));
    const hidden = chars.slice(shown).join("");

    return (
      <span key={key} className={INLINE_CLASS[inline.kind]}>
        {chars.slice(0, shown).join("")}
        {/* O restante invisível reserva o espaço final e evita o balão "crescer" */}
        {hidden && <span className="invisible">{hidden}</span>}
      </span>
    );
  };

  return (
    <>
      {isTyping && <span className="sr-only">{text}</span>}
      <div aria-hidden={isTyping || undefined} className="flex flex-col gap-1.5">
        {blocks.map((block, index) =>
          block.marker ? (
            <div key={index} className="flex gap-2 pl-0.5">
              <span className={cn("shrink-0 font-heading font-extrabold text-red-light", count <= block.inlines[0]?.start && "invisible")}>
                {block.marker}
              </span>
              <p className="min-w-0">{block.inlines.map(renderInline)}</p>
            </div>
          ) : (
            <p key={index}>{block.inlines.map(renderInline)}</p>
          )
        )}
      </div>
    </>
  );
}
