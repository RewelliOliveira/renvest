import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MascotHello, MascotPoint, MascotPlan, MascotThinking } from "@/assets/icons";
import { completeLesson, getLesson } from "@/app/Trail/services/trailApi";
import type { LessonContent, TrailData } from "@/app/Trail/types/types";
import { setTrailData } from "@/app/Trail/hooks/useTrail";
import { sendChatMessage } from "../services/chatApi";
import type { MissionMode, LearningPhase, ChatHistoryItem, LearningStep, QuizStep } from "../types/types";

const HISTORY_WINDOW = 6;
const MASCOTS = [MascotHello, MascotPoint, MascotPlan];

function toLearningSteps(lesson: LessonContent): LearningStep[] {
  return lesson.slides.map((slide, index) => ({
    id: index + 1,
    mascot: MASCOTS[index % MASCOTS.length],
    title: slide.title,
    bubbleText: slide.text,
  }));
}

function toQuizSteps(lesson: LessonContent): QuizStep[] {
  return lesson.quiz.map((question, index) => ({
    id: question.id,
    mascot: MASCOTS[index % MASCOTS.length],
    question: question.question,
    explanation: question.explanation,
    options: question.options.map((option) => ({
      ...option,
      isCorrect: option.id === question.correct_option,
    })),
  }));
}

export function useChatMission(lessonId: string) {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [mode, setMode] = useState<MissionMode>("learning");
  const [slideIndex, setSlideIndex] = useState(0);
  const [phase, setPhase] = useState<LearningPhase>("slides");
  const [chatReply, setChatReply] = useState<string | null>(null);
  // Resposta a uma dúvida feita no meio dos slides; não interrompe a sequência da lição
  const [slideReply, setSlideReply] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);

  // Fila de questões: quem erra volta para o fim e precisa ser refeita até acertar
  const [quizQueue, setQuizQueue] = useState<string[]>([]);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<string[]>([]);
  const [missedIds, setMissedIds] = useState<string[]>([]);
  const [attemptCount, setAttemptCount] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [completedTrail, setCompletedTrail] = useState<TrailData | null>(null);

  useEffect(() => {
    let active = true;
    getLesson(lessonId)
      .then((data) => {
        if (active) setLesson(data);
      })
      .catch((err: unknown) => {
        if (active) setLoadError(err instanceof Error ? err.message : "Não foi possível carregar a lição.");
      });
    return () => {
      active = false;
    };
  }, [lessonId]);

  const learningSteps = useMemo(() => (lesson ? toLearningSteps(lesson) : []), [lesson]);
  const quizSteps = useMemo(() => (lesson ? toQuizSteps(lesson) : []), [lesson]);

  const currentSlide = learningSteps[slideIndex];
  const isLastSlide = slideIndex === learningSteps.length - 1;
  const currentQuestion = quizSteps.find((step) => step.id === quizQueue[0]);
  const isCorrectAnswer =
    hasAnswered && !!currentQuestion?.options.find((option) => option.id === selectedId)?.isCorrect;
  const isRetry = !!currentQuestion && missedIds.includes(currentQuestion.id);
  const isLastQuestion = quizQueue.length === 1 && isCorrectAnswer;
  const totalProgress = learningSteps.length + quizSteps.length + 1;

  const freeChatIntro = lesson
    ? `Ótimo! Agora é a sua vez. Se ficou alguma dúvida sobre ${lesson.title.toLowerCase()}, pode me perguntar antes de ir para o quiz!`
    : "";
  const bubbleText =
    phase === "free-chat" ? chatReply ?? freeChatIntro : slideReply ?? currentSlide?.bubbleText ?? "";

  const progressValue =
    mode === "learning"
      ? ((slideIndex + (phase === "free-chat" ? 2 : 1)) / totalProgress) * 100
      : ((learningSteps.length + 1 + answeredCorrectly.length) / totalProgress) * 100;

  const resetQuestion = () => {
    setSelectedId(null);
    setHasAnswered(false);
  };

  const handleBack = () => {
    if (mode === "quiz") {
      setMode("learning");
      resetQuestion();
    } else if (slideReply) {
      setSlideReply(null);
    } else if (phase === "free-chat") {
      setPhase("slides");
    } else if (slideIndex > 0) {
      setSlideIndex((prev) => prev - 1);
    } else {
      navigate("/trail");
    }
  };

  const handleContinueLearning = () => {
    setSlideReply(null);
    if (isLastSlide) {
      setPhase("free-chat");
      setChatReply(null);
    } else {
      setSlideIndex((prev) => prev + 1);
    }
  };

  const handleChatMessage = async (text: string) => {
    const message = text.trim();
    if (!message || isTyping || !lesson) return;
    const setReply = phase === "slides" ? setSlideReply : setChatReply;
    setIsTyping(true);
    try {
      const response = await sendChatMessage({
        message,
        module: lesson.module_id,
        history: chatHistory.slice(-HISTORY_WINDOW),
      });
      setReply(response.reply);
      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: response.reply },
      ]);
    } catch {
      setReply("Desculpe, tive uma instabilidade temporária ao buscar a resposta. Tente novamente em instantes!");
    } finally {
      setIsTyping(false);
    }
  };

  const handleStartQuiz = () => {
    setQuizQueue(quizSteps.map((step) => step.id));
    setAnsweredCorrectly([]);
    setMissedIds([]);
    setAttemptCount(0);
    resetQuestion();
    setMode("quiz");
  };

  const handleSelectQuizOption = (optionId: string) => {
    if (hasAnswered) return;
    setSelectedId(optionId);
  };

  const handleConfirmQuiz = () => {
    if (!selectedId || hasAnswered) return;
    const isCorrect = !!currentQuestion?.options.find((option) => option.id === selectedId)?.isCorrect;
    navigator.vibrate?.(isCorrect ? 40 : [80, 60, 80]);
    setHasAnswered(true);
  };

  const handleContinueQuiz = async () => {
    if (!hasAnswered || isFinishing || !currentQuestion) return;
    if (!isLastQuestion) {
      const [head, ...rest] = quizQueue;
      if (isCorrectAnswer) {
        setAnsweredCorrectly((prev) => [...prev, head]);
        setQuizQueue(rest);
      } else {
        setMissedIds((prev) => (prev.includes(head) ? prev : [...prev, head]));
        setQuizQueue([...rest, head]);
      }
      setAttemptCount((prev) => prev + 1);
      resetQuestion();
      return;
    }

    setIsFinishing(true);
    setFinishError(null);
    try {
      const trail = await completeLesson(lessonId);
      setTrailData(trail);
      setCompletedTrail(trail);
    } catch (err: unknown) {
      setFinishError(err instanceof Error ? err.message : "Não foi possível registrar a conclusão da lição.");
    } finally {
      setIsFinishing(false);
    }
  };

  const handleFinish = () => {
    navigate("/trail", { replace: true, state: { completedNodeKey: lessonId } });
  };

  const completion = completedTrail
    ? {
        streak: completedTrail.streak,
        firstTryCorrect: quizSteps.length - missedIds.length,
        total: quizSteps.length,
      }
    : null;

  // Enquanto o Rev busca a resposta de uma dúvida, o mascote fica pensativo
  const MascotComponent = isTyping
    ? MascotThinking
    : (mode === "quiz" ? currentQuestion?.mascot : currentSlide?.mascot) ?? MascotHello;

  return {
    lesson,
    loadError,
    mode,
    slideIndex,
    phase,
    bubbleText,
    isShowingReply: phase === "slides" && slideReply !== null,
    isTyping,
    attemptCount,
    quizSteps,
    correctCount: answeredCorrectly.length,
    isCorrectAnswer,
    isRetry,
    selectedId,
    hasAnswered,
    currentQuestion,
    isLastQuestion,
    progressValue,
    MascotComponent,
    isFinishing,
    finishError,
    completion,
    handleFinish,
    handleBack,
    handleContinueLearning,
    handleChatMessage,
    handleStartQuiz,
    handleSelectQuizOption,
    handleConfirmQuiz,
    handleContinueQuiz,
  };
}
