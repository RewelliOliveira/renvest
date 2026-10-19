import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { AlertCircle, BarChart2, CheckCircle2, FileText, RotateCcw, Trophy, XCircle } from "lucide-react";
import { cn } from "cn";
import { MascotHello, MascotPlan } from "@/assets/icons";
import { MascotLoader } from "@/components/ui/MascotLoader";
import { useAvatar } from "@/lib/avatar";
import { OptionButton } from "@/components/ui/OptionButton";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { MissionHeader } from "@/app/Chat/components/MissionHeader";
import { startExam, submitExam } from "@/app/Trail/services/trailApi";
import type { ExamResult, ExamStart } from "@/app/Trail/types/types";

const primaryButton =
  "w-full py-3.5 sm:py-4 rounded-xl font-bold text-white text-base bg-red border-b-4 border-red-dark active:border-b-0 active:translate-y-0.5 transition-all shadow-lg hover:brightness-105 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";
const secondaryButton =
  "w-full py-3 rounded-xl font-bold text-white/85 text-sm border border-white/15 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center gap-2";

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function ExamResultView({ result, onRetry }: { result: ExamResult; onRetry: () => void }) {
  const navigate = useNavigate();
  const finishedTrail = result.passed && result.trail.completed;

  return (
    <main className="flex-1 w-full min-h-0 overflow-y-auto no-scrollbar py-2 flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "rounded-2xl border p-5 text-center",
          result.passed ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red/10 border-red/30"
        )}
      >
        {result.passed ? (
          <Trophy className="w-10 h-10 text-yellow-300 fill-yellow-400/30 mx-auto mb-2" />
        ) : (
          <RotateCcw className="w-10 h-10 text-red-light mx-auto mb-2" />
        )}
        <p className="text-3xl font-extrabold text-white">
          {result.correct_count}/{result.total}
        </p>
        <h2 className="text-base font-bold text-white mt-1">
          {result.passed ? "Você foi aprovado!" : "Quase lá!"}
        </h2>
        <p className="text-xs text-neutral-300 mt-1">
          {result.passed
            ? finishedTrail
              ? "Você concluiu o último módulo da trilha."
              : "O próximo módulo está liberado na trilha."
            : `Você precisa de pelo menos ${percent(result.pass_score)} de acertos. Revise as explicações e tente de novo.`}
        </p>
      </motion.div>

      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Revisão das questões</h3>
        {result.results.map((item, index) => (
          <div key={item.question_id} className="rounded-xl bg-white/5 border border-white/10 p-3.5 flex flex-col gap-2">
            <div className="flex items-start gap-2">
              {item.is_correct ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 mt-0.5 text-red shrink-0" />
              )}
              <p className="text-sm font-semibold text-white leading-snug">
                {index + 1}. {item.question}
              </p>
            </div>
            <ul className="flex flex-col gap-1 pl-6">
              {item.options.map((option) => {
                const isCorrect = option.id === item.correct_option;
                const isChosen = option.id === item.selected_option;
                return (
                  <li
                    key={option.id}
                    className={cn(
                      "text-xs leading-snug",
                      isCorrect ? "text-emerald-300 font-semibold" : isChosen ? "text-red-light line-through" : "text-white/45"
                    )}
                  >
                    {option.text}
                    {isChosen && !isCorrect ? " (sua resposta)" : ""}
                  </li>
                );
              })}
            </ul>
            <p className="text-xs text-neutral-300 leading-relaxed pl-6">{item.explanation}</p>
            <p className="text-[11px] text-white/55 pl-6 flex items-start gap-1">
              <FileText className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
              <span>
                Fonte: <strong className="text-white/75">{item.source.document}</strong> ({item.source.section})
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 pt-1 pb-2">
        {finishedTrail ? (
          <button type="button" className={primaryButton} onClick={() => navigate("/conclusao", { replace: true })}>
            Ver minha conquista 🎉
          </button>
        ) : result.passed ? (
          <button type="button" className={primaryButton} onClick={() => navigate("/trail", { replace: true })}>
            Continuar na trilha
          </button>
        ) : (
          <>
            <button type="button" className={primaryButton} onClick={onRetry}>
              Tentar novamente
            </button>
            <button type="button" className={secondaryButton} onClick={() => navigate("/trail", { replace: true })}>
              Revisar as lições
            </button>
          </>
        )}
      </div>
    </main>
  );
}

function ExamScreen({ moduleId, onRetry }: { moduleId: string; onRetry: () => void }) {
  const navigate = useNavigate();
  const [avatar] = useAvatar();
  const startRequest = useRef<Promise<ExamStart> | null>(null);
  const [exam, setExam] = useState<ExamStart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);

  // Evita criar duas tentativas quando o StrictMode executa o efeito duas vezes
  useEffect(() => {
    let active = true;
    startRequest.current ??= startExam(moduleId);
    startRequest.current
      .then((data) => {
        if (active) setExam(data);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Não foi possível iniciar o teste final.");
      });
    return () => {
      active = false;
    };
  }, [moduleId]);

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 px-4">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-sm text-neutral-200">{error}</p>
        <button type="button" className={cn(primaryButton, "max-w-xs")} onClick={() => navigate("/trail")}>
          Voltar para a trilha
        </button>
      </div>
    );
  }

  if (!exam) {
    return <MascotLoader title="Sorteando as questões" />;
  }

  if (result) {
    return (
      <>
        <MissionHeader progressValue={100} mode="learning" counterLabel="" onBack={() => navigate("/trail")} />
        <ExamResultView result={result} onRetry={onRetry} />
      </>
    );
  }

  const question = exam.questions[index];
  const selected = answers[question.id] ?? null;
  const isLast = index === exam.questions.length - 1;

  const handleNext = async () => {
    if (!selected) return;
    if (!isLast) {
      setIndex((prev) => prev + 1);
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      setResult(await submitExam(exam.attempt_id, answers));
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Não foi possível enviar as respostas do teste.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MissionHeader
        progressValue={((index + 1) / exam.questions.length) * 100}
        mode="quiz"
        counterLabel={`${index + 1}/${exam.questions.length}`}
        onBack={() => (index > 0 ? setIndex((prev) => prev - 1) : navigate("/trail"))}
      />

      <main className="flex-1 flex flex-col justify-center w-full min-h-0 overflow-y-auto no-scrollbar py-2">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col gap-4 my-auto"
        >
          <div className="w-full flex items-center gap-3">
            <div className="w-20 h-20 shrink-0 flex items-center justify-center">
              {index % 2 === 0 ? (
                <MascotPlan className="h-full w-auto object-contain" />
              ) : (
                <MascotHello variant={avatar} className="h-full w-auto object-contain" />
              )}
            </div>
            <div className="flex-1">
              <SpeechBubble direction="left">
                {index === 0 ? "Teste final! Escolha uma alternativa em cada questão." : "Continue, você está indo bem!"}
              </SpeechBubble>
            </div>
          </div>

          <h2 className="text-white text-base sm:text-lg font-bold leading-snug">{question.question}</h2>

          <div className="w-full flex flex-col gap-2.5 sm:gap-3">
            {question.options.map((option) => (
              <OptionButton
                key={option.id}
                isSelected={selected === option.id}
                onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.id }))}
                icon={
                  <BarChart2
                    className={selected === option.id ? "w-5 h-5 text-option-selected-text" : "w-5 h-5 text-blue-400/80"}
                  />
                }
              >
                {option.text}
              </OptionButton>
            ))}
          </div>
        </motion.div>
      </main>

      <footer className="w-full pt-2 pb-1 shrink-0">
        {submitError && (
          <p className="text-xs text-red-300 text-center pb-2" role="alert">
            {submitError}
          </p>
        )}
        <button type="button" className={primaryButton} disabled={!selected || isSubmitting} onClick={handleNext}>
          {isLast ? (isSubmitting ? "Corrigindo..." : "Enviar respostas") : "Próxima"}
        </button>
      </footer>
    </>
  );
}

export function ExamPage() {
  const { moduleId = "" } = useParams();
  const [attempt, setAttempt] = useState(0);

  return (
    <div className="h-dvh max-h-dvh w-full overflow-hidden select-none bg-linear-to-b from-[#000815] via-[#00050d] to-[#000000] flex flex-col items-center px-4 sm:px-6 py-4 sm:py-6">
      <div className="w-full max-w-sm sm:max-w-md flex flex-col justify-between h-full">
        {/* Nova key a cada tentativa: novo sorteio de questões */}
        <ExamScreen key={`${moduleId}-${attempt}`} moduleId={moduleId} onRetry={() => setAttempt((prev) => prev + 1)} />
      </div>
    </div>
  );
}
