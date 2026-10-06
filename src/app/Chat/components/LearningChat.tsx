import { useState } from "react";
import type { FormEvent } from "react";
import { MessageCircle, ChevronUp, ChevronDown, Sparkles, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "cn";

interface LearningChatProps {
  suggestions: string[];
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function LearningChat({
  suggestions,
  onSend,
  disabled,
}: LearningChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || disabled) return;
    onSend(inputValue.trim());
    setInputValue("");
    setIsOpen(false);
  };

  const handleChip = (text: string) => {
    onSend(text);
    setIsOpen(false);
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0b1322]/80 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-white/70 hover:text-white transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <MessageCircle className="w-4 h-4 text-[#38bdf8]" />
          <span>Ficou com alguma dúvida?</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="px-4 pt-3 pb-1 flex gap-2 overflow-x-auto no-scrollbar">
              {suggestions.map((chip) => (
                <motion.button
                  key={chip}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleChip(chip)}
                  disabled={disabled}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Sparkles className="w-3 h-3 text-[#38bdf8]" />
                  {chip}
                </motion.button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2.5">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ou digite sua dúvida..."
                disabled={disabled}
                className="flex-1 bg-transparent px-2 py-1.5 text-sm text-white placeholder:text-white/40 focus:outline-none disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || disabled}
                className={cn(
                  "p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center",
                  inputValue.trim() && !disabled
                    ? "bg-red border-b-2 border-red-dark text-white"
                    : "text-white/30 cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
