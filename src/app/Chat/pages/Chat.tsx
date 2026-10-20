import { useState, useRef, useEffect, useCallback } from "react";
import type { FormEvent } from "react";
import { Send, Bot, ExternalLink, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "cn";
import { MascotHello } from "@/assets/icons";
import { AutoGrowTextarea } from "@/components/ui/AutoGrowTextarea";
import { useAvatar } from "@/lib/avatar";
import { loadChatHistory, saveChatHistory } from "@/lib/chatHistory";
import { useAuth } from "@/app/AuthLogin/hooks/useAuth";
import { useTrail } from "@/app/Trail/hooks/useTrail";
import { sendChatMessage, getChatSuggestions } from "../services/chatApi";
import { ChatSidePanel } from "../components/ChatSidePanel";
import type { ChatMessage, ChatHistoryItem, ChatSource } from "../types/types";

const MAX_INPUT_LENGTH = 500;

export function Chat() {
  const { user } = useAuth();
  const [avatar] = useAvatar();
  const userName = user?.name ? user.name.split(" ")[0] : "";

  const [messages, setMessages] = useState<ChatMessage[]>(() => loadChatHistory(user?.id) ?? [
    {
      id: "welcome-1",
      sender: "bot",
      text: `Olá${userName ? `, ${userName}` : ""}! Eu sou o Rev, seu tutor de inteligência financeira da Renvest.`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    {
      id: "welcome-2",
      sender: "bot",
      text: "Estou aqui para tirar dúvidas sobre investimentos, FGC, reserva de emergência e finanças pessoais. O que deseja aprender agora?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const { trail } = useTrail();
  const chatModule = trail ? trail.current_module_id : undefined;
  const suggestionsModule = trail ? trail.current_module_id ?? trail.modules.at(-1)?.id : undefined;

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (user?.id) saveChatHistory(user.id, messages);
  }, [messages, user?.id]);

  useEffect(() => {
    if (!suggestionsModule) return;
    const moduleId = suggestionsModule;
    let isMounted = true;
    async function loadInitialSuggestions() {
      try {
        const initial = await getChatSuggestions(moduleId);
        if (isMounted && initial && initial.length > 0) {
          setSuggestions(initial);
        }
      } catch {
        // Silencioso: se falhar, o chat continuará funcionando normalmente
      }
    }

    loadInitialSuggestions();
    return () => {
      isMounted = false;
    };
  }, [suggestionsModule]);

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isTyping) return;

    setErrorMessage(null);
    setLastFailedMessage(null);

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text,
      time: currentTime,
    };

    // Monta o histórico das últimas mensagens para enviar ao backend RAG
    const recentHistory: ChatHistoryItem[] = messages.slice(-6).map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await sendChatMessage({
        message: text,
        module: chatModule,
        history: recentHistory,
      });

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: "bot",
        text: response.reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: response.source,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Atualiza as sugestões dinâmicas recebidas da IA
      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao se comunicar com o Rev.";
      setErrorMessage(msg);
      setLastFailedMessage(text);
    } finally {
      setIsTyping(false);
    }
  };

  const sources = messages.reduce<ChatSource[]>((acc, msg) => {
    const source = msg.source;
    if (source && !acc.some((item) => item.document === source.document && item.section === source.section)) {
      acc.push(source);
    }
    return acc;
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      handleSendMessage(lastFailedMessage);
    }
  };

  return (
    <div className="h-dvh max-h-dvh w-full overflow-hidden bg-linear-to-b from-[#000815] via-[#00050d] to-[#000000] text-white flex">
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* Top Header */}
        <header className="sticky top-0 z-30 w-full bg-[#000815]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 sm:px-6">
          <div className="max-w-md lg:max-w-3xl mx-auto flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-linear-to-br from-red/30 to-sky-500/30 border border-white/15 flex items-center justify-center p-1 shadow-inner shrink-0">
              <MascotHello variant={avatar} className="h-full w-auto object-contain" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#000815]" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="type-h4 text-white truncate">
                Rev • Tutor Renvest
              </h1>
              <p className="type-micro text-emerald-400">Online</p>
            </div>
          </div>
        </header>

        {/* Messages Stream */}
        <main className="flex-1 w-full max-w-md lg:max-w-3xl mx-auto px-4 lg:px-6 py-3 overflow-y-auto no-scrollbar flex flex-col gap-3 min-h-0">
          <div className="flex flex-col gap-3 my-auto pt-2">
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex items-end gap-2 max-w-[88%] lg:max-w-[75%]",
                    isBot ? "self-start" : "self-end flex-row-reverse"
                  )}
                >
                  {isBot ? (
                    <div className="w-7 h-7 rounded-full bg-red/20 border border-red/40 flex items-center justify-center shrink-0 mb-1">
                      <Bot className="w-4 h-4 text-red-light" />
                    </div>
                  ) : null}

                  <div
                    className={cn(
                      "min-w-0 wrap-break-word rounded-2xl px-3.5 py-2.5 type-body-sm shadow-md flex flex-col gap-1.5",
                      isBot
                        ? "bg-[#0b162a] border border-white/10 text-neutral-100 rounded-bl-xs"
                        : "bg-red text-white font-medium border-b-2 border-red-dark rounded-br-xs"
                    )}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Fonte oficial RAG quando disponível */}
                    {isBot && msg.source && (
                      <div className="mt-1 pt-1.5 border-t border-white/10 flex items-start justify-between gap-2 type-micro text-sky-300">
                        <div className="flex items-start gap-1 min-w-0">
                          <ShieldCheck className="w-3 h-3 mt-px text-sky-400 shrink-0" />
                          <span className="line-clamp-2">
                            {msg.source.institution ? `${msg.source.institution} • ` : ""}
                            {msg.source.document} ({msg.source.section})
                          </span>
                        </div>
                        {msg.source.url && (
                          <a
                            href={msg.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-0.5 shrink-0 text-white/70 hover:text-white"
                            title="Consultar documento oficial"
                          >
                            <span>Ver</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    )}

                    <span
                      className={cn(
                        "text-[10px] block text-right font-mono tabular-nums",
                        isBot ? "text-white/40" : "text-white/70"
                      )}
                    >
                      {msg.time}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 self-start"
              >
                <div className="w-7 h-7 rounded-full bg-red/20 border border-red/40 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-red-light" />
                </div>
                <div className="rounded-2xl bg-[#0b162a] border border-white/10 px-4 py-2.5 flex items-center gap-1 shadow-md">
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}

            {/* Error Banner with retry */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl bg-red-950/60 border border-red-500/40 p-2.5 type-caption text-red-200 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="truncate">{errorMessage}</span>
                  </div>
                  {lastFailedMessage && (
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-800/60 hover:bg-red-700/80 text-white type-micro transition-colors shrink-0 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Tentar de novo</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Dynamic Contextual Suggestions */}
          {suggestions.length > 0 && (
            <div className="pt-2 xl:hidden">
              <span className="type-overline text-white/50 block mb-1.5">
                Sugestões de perguntas:
              </span>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    disabled={isTyping}
                    onClick={() => handleSendMessage(item)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full type-chip bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Input Box */}
        <div className="w-full max-w-md lg:max-w-3xl mx-auto px-4 lg:px-6 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-5 pt-2 shrink-0">
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 p-1.5 rounded-2xl bg-[#0b162a]/90 border border-white/10 shadow-lg"
          >
            <AutoGrowTextarea
              value={inputValue}
              maxLength={MAX_INPUT_LENGTH}
              onValueChange={setInputValue}
              onSubmit={() => handleSendMessage(inputValue)}
              placeholder="Pergunte ao Rev sobre investimentos..."
              className="flex-1 min-w-0 bg-transparent px-3 py-2 type-body-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Enviar mensagem"
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0",
                inputValue.trim() && !isTyping
                  ? "bg-red text-white hover:brightness-110 shadow-md active:scale-95"
                  : "bg-white/5 text-white/30 cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="hidden lg:block mt-2 type-micro text-white/35 text-center">
            Enter envia · Shift+Enter quebra linha
          </p>
        </div>
      </div>

      <ChatSidePanel
        suggestions={suggestions}
        sources={sources}
        disabled={isTyping}
        onSelectSuggestion={handleSendMessage}
      />
    </div>
  );
}
