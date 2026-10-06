import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { Send, Sparkles, Bot } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "cn";
import { MascotHello } from "@/assets/icons";
import { BottomNav } from "@/app/Trail/components/BottomNav";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Olá! Eu sou o Rev, seu assistente de inteligência financeira da Renvest. 🚀",
    time: "Agora",
  },
  {
    id: "welcome-2",
    sender: "bot",
    text: "Estou aqui para esclarecer qualquer dúvida sobre investimentos, conceitos de renda fixa, ações da B3, segurança do FGC e finanças pessoais. O que deseja saber hoje?",
    time: "Agora",
  },
];

const SUGGESTIONS = [
  "O que é CDI e Selic?",
  "Como o FGC protege meu dinheiro?",
  "Qual a diferença entre CDB e Poupança?",
  "Como dar os primeiros passos?",
];

const PREDEFINED_REPLIES: Record<string, string> = {
  cdi: "O CDI (Certificado de Depósito Interbancário) é a taxa usada pelos bancos para emprestar dinheiro entre si. Ele anda quase colado na taxa Selic (taxa básica de juros do país). Quando um investimento rende 100% do CDI, significa que acompanha o ritmo dos juros do Brasil!",
  fgc: "O Fundo Garantidor de Créditos protege depósitos em instituições financeiras associadas até o limite de R$ 250 mil por CPF e por instituição, com teto global de R$ 1 milhão a cada 4 anos. Produtos como Poupança, CDB, LCI e LCA contam com essa cobertura!",
  cdb: "O CDB é um empréstimo que você faz para um banco em troca de juros, e quase sempre rende mais que a poupança tradicional, mantendo a mesma garantia de segurança pelo FGC!",
  passos: "Para começar com segurança: 1º monte sua reserva de emergência em produtos líquidos e de baixo risco (como Tesouro Selic ou CDB de liquidez diária); 2º estude o básico dos conceitos; 3º invista com regularidade!",
};

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateReply = (userText: string) => {
    const lower = userText.toLowerCase();
    if (lower.includes("cdi") || lower.includes("selic")) {
      return PREDEFINED_REPLIES.cdi;
    }
    if (lower.includes("fgc") || lower.includes("garantia") || lower.includes("seguro")) {
      return PREDEFINED_REPLIES.fgc;
    }
    if (lower.includes("cdb") || lower.includes("poupança") || lower.includes("poupanca")) {
      return PREDEFINED_REPLIES.cdb;
    }
    if (lower.includes("começar") || lower.includes("passo") || lower.includes("início")) {
      return PREDEFINED_REPLIES.passos;
    }
    return `Excelente pergunta sobre "${userText}"! Na Renvest, nosso foco é ajudar você a entender o risco e o retorno de cada decisão. Lembre-se sempre de alinhar o investimento aos seus objetivos e verificar se o produto conta com a proteção do FGC ou garantia do Tesouro Nacional.`;
  };

  const handleSendMessage = (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: "bot",
        text: generateReply(text),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 850);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="h-dvh max-h-dvh w-full overflow-hidden select-none bg-linear-to-b from-[#000815] via-[#00050d] to-[#000000] text-white flex flex-col justify-between">
      <header className="sticky top-0 z-30 w-full bg-[#000815]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-linear-to-br from-red/30 to-sky-500/30 border border-white/15 flex items-center justify-center p-1 shadow-inner shrink-0">
            <MascotHello className="h-full w-auto object-contain" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#000815]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                Rev • Assistente Renvest
              </h1>
              <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            </div>
            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              Online • Pronto para tirar dúvidas
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-3 overflow-y-auto no-scrollbar flex flex-col gap-3 min-h-0">
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
                  "flex items-end gap-2 max-w-[85%]",
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
                    "rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-md",
                    isBot
                      ? "bg-[#0b162a] border border-white/10 text-neutral-100 rounded-bl-xs"
                      : "bg-red text-white font-medium border-b-2 border-red-dark rounded-br-xs"
                  )}
                >
                  <p>{msg.text}</p>
                  <span
                    className={cn(
                      "text-[9px] block text-right mt-1 font-mono",
                      isBot ? "text-white/40" : "text-white/70"
                    )}
                  >
                    {msg.time}
                  </span>
                </div>
              </motion.div>
            );
          })}

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

          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 3 && (
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-white/50 block mb-1.5">
              Sugestões de perguntas:
            </span>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {SUGGESTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSendMessage(item)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="w-full max-w-md mx-auto px-4 pb-20 pt-2 shrink-0">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0b162a]/90 border border-white/10 shadow-lg"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Pergunte ao Rev sobre investimentos..."
            disabled={isTyping}
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none disabled:opacity-50"
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
      </div>

      <BottomNav currentTab="chat" />
    </div>
  );
}
