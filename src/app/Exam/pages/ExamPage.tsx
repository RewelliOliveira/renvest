import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { WarningCircleIcon, ChartBarIcon, CheckCircleIcon, ArrowCounterClockwiseIcon, TrophyIcon, XCircleIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { MascotHello, MascotPlan } from "@/assets/icons";
import { MascotLoader } from "@/components/ui/MascotLoader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAvatar } from "@/lib/avatar";
import { useQuizKeyboard } from "@/lib/useQuizKeyboard";
import { ImmersiveLayout } from "@/components/layout/ImmersiveLayout";
import { ImmersiveFooter } from "@/components/layout/ImmersiveFooter";
import { OptionButton } from "@/components/ui/OptionButton";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { MissionHeader } from "@/app/Chat/components/MissionHeader";
import { startExam, submitExam } from "@/app/Trail/services/trailApi";
import { setTrailData } from "@/app/Trail/hooks/useTrail";
import type { ExamResult, ExamStart } from "@/app/Trail/types/types";

const primaryButton =
  "w-full py-3.5 sm:py-4 rounded-xl type-button text-white bg-red border-b-4 border-red-dark press-3d transition-all shadow-lg hover:brightness-105 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";
const secondaryButton =
  "w-full py-3 rounded-xl type-button-sm text-white/85 border border-white/15 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center gap-2";

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function ExamResultView({
  result,
  onRetry,
}: {
  result: ExamResult;
  onRetry: () => void;
}) {
  const navigate = useNavigate();
  const finishedTrail = result.passed && result.trail.completed;

  return (
    <main className="flex-1 w-full min-h-0 overflow-y-auto no-scrollbar py-2 flex flex-col gap-4 lg:max-w-6xl lg:mx-auto lg:px-10 lg:pb-10 lg:grid lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-8 lg:items-start">
      <div className="contents lg:flex lg:flex-col lg:gap-4 lg:sticky lg:top-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "order-1 lg:order-0 rounded-2xl border p-5 lg:p-7 text-center",
            result.passed
              ? "bg-emerald-500/10 border-emerald-500/30"
              : "bg-red/10 border-red/30",
          )}
        >
          {result.passed ? (
            <TrophyIcon weight="fill" className="w-10 h-10 text-yellow-300 mx-auto mb-2" />
          ) : (
            <ArrowCounterClockwiseIcon className="w-10 h-10 text-red-light mx-auto mb-2" />
          )}
          <p className="type-display tabular-nums text-white">
            {result.correct_count}/{result.total}
          </p>
          <h2 className="type-h3 text-white mt-1">
            {result.passed ? "Você foi aprovado!" : "Quase lá!"}
          </h2>
          <p className="type-caption text-neutral-300 mt-1">
            {result.passed
              ? finishedTrail
                ? "Você concluiu o último módulo da trilha."
                : "O próximo módulo está liberado na trilha."
              : `Você precisa de pelo menos ${percent(result.pass_score)} de acertos. Revise as explicações e tente de novo.`}
          </p>
        </motion.div>

        <div className="order-3 lg:order-0 flex flex-col gap-2.5 pt-1 pb-2">
          {finishedTrail ? (
            <button
              type="button"
              className={primaryButton}
              onClick={() => navigate("/conclusao", { replace: true })}
            >
              Ver minha conquista
            </button>
          ) : result.passed ? (
            <button
              type="button"
              className={primaryButton}
              onClick={() =>
                navigate("/trail", {
                  replace: true,
                  state: { completedNodeKey: `${result.module_id}-exam` },
                })
              }
            >
              Continuar na trilha
            </button>
          ) : (
            <>
              <button type="button" className={primaryButton} onClick={onRetry}>
                Tentar novamente
              </button>
              <button
                type="button"
                className={secondaryButton}
                onClick={() => navigate("/trail", { replace: true })}
              >
                Revisar as lições
              </button>
            </>
          )}
        </div>
      </div>

      <div className="order-2 lg:order-0 flex flex-col gap-3">
        <h3 className="type-overline text-white/50">
          Revisão das questões
        </h3>
        {result.results.map((item, index) => (
          <div
            key={item.question_id}
            className="rounded-xl bg-white/5 border border-white/10 p-3.5 flex flex-col gap-2"
          >
            <div className="flex items-start gap-2">
              {item.is_correct ? (
                <CheckCircleIcon className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
              ) : (
                <XCircleIcon className="w-4 h-4 mt-0.5 text-red shrink-0" />
              )}
              <p className="type-h4 text-white">
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
                      "type-caption",
                      isCorrect
                        ? "text-emerald-300 font-semibold"
                        : isChosen
                          ? "text-red-light line-through"
                          : "text-white/45",
                    )}
                  >
                    {option.text}
                    {isChosen && !isCorrect ? " (sua resposta)" : ""}
                  </li>
                );
              })}
            </ul>
            <p className="type-body-sm text-neutral-300 pl-6">
              {item.explanation}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

function ExamScreen({
  moduleId,
  onRetry,
}: {
  moduleId: string;
  onRetry: () => void;
}) {
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
  const [isLeaving, setIsLeaving] = useState(false);

  // Evita criar duas tentativas quando o StrictMode executa o efeito duas vezes
  useEffect(() => {
    let active = true;
    startRequest.current ??= startExam(moduleId);
    startRequest.current
      .then((data) => {
        if (active) setExam(data);
      })
      .catch((err: unknown) => {
        if (active)
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível iniciar o teste final.",
          );
      });
    return () => {
      active = false;
    };
  }, [moduleId]);

  const question = exam?.questions[index];
  const selected = question ? (answers[question.id] ?? null) : null;
  const isLast = !!exam && index === exam.questions.length - 1;

  const selectOption = (optionId: string) => {
    if (question) setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  };

  const handleNext = async () => {
    if (!exam || !selected || isSubmitting) return;
    if (!isLast) {
      setIndex((prev) => prev + 1);
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const examResult = await submitExam(exam.attempt_id, answers);
      setTrailData(examResult.trail);
      setResult(examResult);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Não foi possível enviar as respostas do teste.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const leaveExam = () => navigate("/trail");
  const handleClose = () =>
    Object.keys(answers).length > 0 ? setIsLeaving(true) : leaveExam();

  useQuizKeyboard({
    optionCount: question?.options.length ?? 0,
    onSelect: (optionIndex) => {
      const option = question?.options[optionIndex];
      if (option) selectOption(option.id);
    },
    onEnter: () => void handleNext(),
    enabled: !!question && !result && !isLeaving,
  });

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 px-4">
        <WarningCircleIcon className="w-8 h-8 text-red-400" />
        <p className="type-body text-neutral-200">{error}</p>
        <button
          type="button"
          className={cn(primaryButton, "max-w-xs")}
          onClick={() => navigate("/trail")}
        >
          Voltar para a trilha
        </button>
      </div>
    );
  }

  if (!exam || !question) {
    return <MascotLoader title="Sorteando as questões" />;
  }

  if (result) {
    return (
      <>
        <MissionHeader progressValue={100} onBack={() => navigate("/trail")} />
        <ExamResultView result={result} onRetry={onRetry} />
      </>
    );
  }

  return (
    <>
      <MissionHeader
        progressValue={((index + 1) / exam.questions.length) * 100}
        onBack={() =>
          index > 0 ? setIndex((prev) => prev - 1) : handleClose()
        }
        onClose={handleClose}
      />

      <main className="flex-1 flex flex-col justify-center w-full min-h-0 overflow-y-auto no-scrollbar py-2 lg:px-10">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col gap-4 my-auto lg:max-w-3xl lg:mx-auto lg:gap-6"
        >
          <div className="w-full flex items-center gap-3">
            <div className="rev-wave w-20 h-20 lg:w-32 lg:h-32 shrink-0 flex items-center justify-center">
              {index % 2 === 0 ? (
                <MascotPlan className="h-full w-auto object-contain" />
              ) : (
                <MascotHello
                  variant={avatar}
                  className="h-full w-auto object-contain"
                />
              )}
            </div>
            <div className="flex-1">
              <SpeechBubble direction="left">
                {index === 0
                  ? "Teste final! Escolha uma alternativa em cada questão."
                  : "Continue, você está indo bem!"}
              </SpeechBubble>
            </div>
          </div>

          <h2 className="text-white type-question">
            {question.question}
          </h2>

          <div className="w-full flex flex-col gap-2.5 sm:gap-3">
            {question.options.map((option, optionIndex) => (
              <OptionButton
                key={option.id}
                isSelected={selected === option.id}
                shortcut={optionIndex + 1}
                onClick={() => selectOption(option.id)}
                icon={
                  <ChartBarIcon
                    className={
                      selected === option.id
                        ? "w-5 h-5 text-option-selected-text"
                        : "w-5 h-5 text-blue-400/80"
                    }
                  />
                }
              >
                {option.text}
              </OptionButton>
            ))}
          </div>
        </motion.div>
      </main>

      <ImmersiveFooter
        aside={
          submitError && (
            <p
              className="type-caption text-red-300 text-center lg:text-left"
              role="alert"
            >
              {submitError}
            </p>
          )
        }
      >
        <button
          type="button"
          className={primaryButton}
          disabled={!selected || isSubmitting}
          onClick={handleNext}
        >
          {isLast
            ? isSubmitting
              ? "Corrigindo..."
              : "Enviar respostas"
            : "Próxima"}
        </button>
      </ImmersiveFooter>

      <ConfirmDialog
        open={isLeaving}
        title="Sair do teste?"
        description="Suas respostas serão perdidas e, na próxima vez, novas questões serão sorteadas."
        cancelLabel="Continuar o teste"
        confirmLabel="Sair do teste"
        onCancel={() => setIsLeaving(false)}
        onConfirm={leaveExam}
      />
    </>
  );
}

export function ExamPage() {
  const { moduleId = "" } = useParams();
  const [attempt, setAttempt] = useState(0);

  return (
    <ImmersiveLayout>
      {/* Nova key a cada tentativa: novo sorteio de questões */}
      <ExamScreen
        key={`${moduleId}-${attempt}`}
        moduleId={moduleId}
        onRetry={() => setAttempt((prev) => prev + 1)}
      />
    </ImmersiveLayout>
  );
}
