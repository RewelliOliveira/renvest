import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Sparkles, Send, ChevronDown, ChevronUp, MessageCircle, BarChart2, CheckCircle2, XCircle, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "cn";
import { Progress } from "@/components/ui/progress";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { OptionButton } from "@/components/ui/OptionButton";
import { MODULE_1 } from "./data";
import type { QuizOption, SourceCitation } from "./data";

function buildMockReply(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("poupança"))
    return "Sim! A caderneta de Poupança é um dos produtos cobertos pelo FGC, até o limite de R$ 250.000 por CPF e por instituição.";
  if (q.includes("tesouro"))
    return "O Tesouro Direto NÃO precisa do FGC, pois é garantido diretamente pelo Governo Federal (Tesouro Nacional). É o ativo de menor risco do país!";
  if (q.includes("dois bancos") || q.includes("2 bancos"))
    return "Se você tiver dinheiro em dois bancos diferentes, o limite de R$ 250 mil se aplica separadamente a cada instituição. Caso pertençam ao mesmo conglomerado, o limite é compartilhado.";
  if (q.includes("fundo"))
    return "Fundos de Investimento NÃO são cobertos pelo FGC. O patrimônio do fundo é segregado do patrimônio do banco administrador.";
  if (q.includes("teto") || q.includes("global"))
    return "O teto global do FGC é de R$ 1.000.000 a cada período de 4 anos por CPF.";
  return `Boa pergunta! Sobre "${question}": o FGC foi criado para garantir segurança e estabilidade aos depósitos em instituições financeiras.`;
}

function LearningChat({
  suggestions,
  onSend,
  disabled,
}: {
  suggestions: string[];
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
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

function QuizOptionsList({
  options,
  selectedId,
  hasAnswered,
  source,
  onSelect,
}: {
  options: QuizOption[];
  selectedId: string | null;
  hasAnswered: boolean;
  source: SourceCitation;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="w-full flex flex-col gap-2.5 sm:gap-3">
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        const showSuccess = hasAnswered && option.isCorrect;
        const showError = hasAnswered && isSelected && !option.isCorrect;

        return (
          <OptionButton
            key={option.id}
            isSelected={isSelected}
            isCorrect={option.isCorrect}
            hasAnswered={hasAnswered}
            onClick={() => onSelect(option.id)}
            icon={
              showSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : showError ? (
                <XCircle className="w-5 h-5 text-red" />
              ) : (
                <BarChart2
                  className={
                    isSelected
                      ? "w-5 h-5 text-option-selected-text"
                      : "w-5 h-5 text-blue-400/80"
                  }
                />
              )
            }
          >
            {option.text}
          </OptionButton>
        );
      })}

      {hasAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 mt-1"
        >
          <FileText className="w-4 h-4 text-[#38bdf8] shrink-0" />
          <span>
            Fonte: <strong className="text-white">{source.document}</strong> —{" "}
            {source.section}
          </span>
        </motion.div>
      )}
    </div>
  );
}

const TOTAL_PROGRESS = MODULE_1.learningSteps.length + MODULE_1.quizSteps.length + 1;

export function ChatMission() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"learning" | "quiz">("learning");
  const [slideIndex, setSlideIndex] = useState(0);
  const [phase, setPhase] = useState<"slides" | "free-chat">("slides");
  const [bubbleText, setBubbleText] = useState(MODULE_1.learningSteps[0].bubbleText);
  const [isTyping, setIsTyping] = useState(false);

  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const currentSlide = MODULE_1.learningSteps[slideIndex];
  const isLastSlide = slideIndex === MODULE_1.learningSteps.length - 1;
  const currentQuestion = MODULE_1.quizSteps[quizIndex];
  const isLastQuestion = quizIndex === MODULE_1.quizSteps.length - 1;

  const progressValue =
    mode === "learning"
      ? ((slideIndex + 1) / TOTAL_PROGRESS) * 100
      : ((MODULE_1.learningSteps.length + 1 + quizIndex + 1) / TOTAL_PROGRESS) * 100;

  const handleBack = () => {
    if (mode === "quiz") {
      if (quizIndex > 0) {
        setQuizIndex((prev) => prev - 1);
        setSelectedId(null);
        setHasAnswered(false);
      } else {
        setMode("learning");
      }
    } else {
      if (phase === "free-chat") {
        setPhase("slides");
        setBubbleText(MODULE_1.learningSteps[MODULE_1.learningSteps.length - 1].bubbleText);
      } else if (slideIndex > 0) {
        const prevIndex = slideIndex - 1;
        setSlideIndex(prevIndex);
        setBubbleText(MODULE_1.learningSteps[prevIndex].bubbleText);
      } else {
        navigate("/home");
      }
    }
  };

  const handleContinueLearning = () => {
    if (isLastSlide) {
      setPhase("free-chat");
      setBubbleText("Ótimo! Agora é a sua vez. Se ficou alguma dúvida sobre o FGC, pode me perguntar antes de ir para o teste!");
    } else {
      const nextIndex = slideIndex + 1;
      setSlideIndex(nextIndex);
      setBubbleText(MODULE_1.learningSteps[nextIndex].bubbleText);
    }
  };

  const handleChatMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setBubbleText(buildMockReply(text));
    }, 900);
  };

  const handleSelectQuizOption = (optionId: string) => {
    if (hasAnswered) return;
    setSelectedId(optionId);
    setHasAnswered(true);
  };

  const handleContinueQuiz = () => {
    if (!hasAnswered) return;
    if (isLastQuestion) {
      navigate("/home");
    } else {
      setQuizIndex((prev) => prev + 1);
      setSelectedId(null);
      setHasAnswered(false);
    }
  };

  const MascotComponent = mode === "quiz" ? currentQuestion.mascot : currentSlide.mascot;

  return (
    <div className="h-dvh max-h-dvh w-full overflow-hidden select-none bg-linear-to-b from-[#000815] via-[#00050d] to-[#000000] flex flex-col items-center px-4 sm:px-6 py-4 sm:py-6">
      <div className="w-full max-w-sm sm:max-w-md flex flex-col justify-between h-full">
        <header className="w-full flex items-center gap-3 pt-1 pb-3 shrink-0">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Voltar"
            className="text-white/80 hover:text-white transition-opacity p-1 -ml-1 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <Progress value={progressValue} className="flex-1" />
          {mode === "quiz" && (
            <span className="text-xs font-semibold text-white/50 shrink-0">
              {quizIndex + 1}/{MODULE_1.quizSteps.length}
            </span>
          )}
        </header>

        {mode === "learning" && (
          <main className="flex-1 flex flex-col items-center justify-center w-full my-auto min-h-0 py-2 overflow-y-auto no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={`learn-${slideIndex}-${phase}`}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="w-full flex flex-col items-center justify-center"
              >
                {isTyping ? (
                  <div className="w-full max-w-sm rounded-2xl bg-[#040a14] border-2 border-neutral-600/90 px-5 py-4 flex items-center justify-center gap-1.5 shadow-2xl">
                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                  </div>
                ) : (
                  <SpeechBubble direction="bottom">{bubbleText}</SpeechBubble>
                )}

                <div className="mt-4 sm:mt-6 flex items-center justify-center h-44 sm:h-52 w-full">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
                    className="h-full flex items-center justify-center"
                  >
                    <MascotComponent className="h-full w-auto max-w-48 sm:max-w-55 object-contain drop-shadow-[0_12px_32px_rgba(240,86,86,0.22)]" />
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </main>
        )}

        {mode === "quiz" && (
          <main className="flex-1 flex flex-col justify-center w-full min-h-0 overflow-y-auto no-scrollbar py-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`quiz-${quizIndex}`}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="w-full flex flex-col gap-4 my-auto"
              >
                <div className="w-full flex items-center gap-3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center"
                  >
                    <MascotComponent className="h-full w-auto object-contain drop-shadow-[0_8px_20px_rgba(240,86,86,0.25)]" />
                  </motion.div>
                  <div className="flex-1">
                    <SpeechBubble direction="left">
                      {hasAnswered
                        ? currentQuestion.explanation
                        : "Vamos testar o que você aprendeu sobre o FGC!"}
                    </SpeechBubble>
                  </div>
                </div>

                <div className="w-full pt-1">
                  <h2 className="text-white text-base sm:text-lg font-bold leading-snug">
                    {currentQuestion.question}
                  </h2>
                </div>

                <QuizOptionsList
                  options={currentQuestion.options}
                  selectedId={selectedId}
                  hasAnswered={hasAnswered}
                  source={currentQuestion.source}
                  onSelect={handleSelectQuizOption}
                />
              </motion.div>
            </AnimatePresence>
          </main>
        )}

        <footer className="w-full pt-2 pb-1 flex flex-col gap-2.5 shrink-0">
          {mode === "learning" && (
            <LearningChat
              suggestions={MODULE_1.chatSuggestions}
              onSend={handleChatMessage}
              disabled={isTyping}
            />
          )}

          {mode === "learning" && phase === "free-chat" && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setMode("quiz")}
              className="w-full py-3.5 sm:py-4 rounded-xl font-bold text-white text-base bg-red border-b-4 border-red-dark active:border-b-0 active:translate-y-0.5 transition-all shadow-lg hover:brightness-105 focus-visible:outline-none cursor-pointer"
            >
              Estou pronto para o teste! 🚀
            </motion.button>
          )}

          {mode === "learning" && phase === "slides" && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleContinueLearning}
              className="w-full py-3.5 sm:py-4 rounded-xl font-bold text-white text-base bg-red border-b-4 border-red-dark active:border-b-0 active:translate-y-0.5 transition-all shadow-lg hover:brightness-105 focus-visible:outline-none cursor-pointer"
            >
              Continuar
            </motion.button>
          )}

          {mode === "quiz" && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleContinueQuiz}
              disabled={!hasAnswered}
              className={cn(
                "w-full py-3.5 sm:py-4 rounded-xl font-bold text-white text-base transition-all shadow-lg focus-visible:outline-none cursor-pointer",
                hasAnswered
                  ? "bg-red border-b-4 border-red-dark active:border-b-0 active:translate-y-0.5 hover:brightness-105"
                  : "bg-neutral-800 border-b-4 border-neutral-900 opacity-40 cursor-not-allowed"
              )}
            >
              {isLastQuestion && hasAnswered ? "Concluir Missão 🎉" : "Continuar"}
            </motion.button>
          )}
        </footer>
      </div>
    </div>
  );
}
