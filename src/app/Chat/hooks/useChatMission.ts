import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MODULE_1 } from "../data";
import { buildMockReply } from "../utils/mockReply";
import type { MissionMode, LearningPhase } from "../types";

const TOTAL_PROGRESS = MODULE_1.learningSteps.length + MODULE_1.quizSteps.length + 1;

export function useChatMission() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<MissionMode>("learning");
  const [slideIndex, setSlideIndex] = useState(0);
  const [phase, setPhase] = useState<LearningPhase>("slides");
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
        setSelectedId(null);
        setHasAnswered(false);
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
        navigate("/trail");
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
  };

  const handleConfirmQuiz = () => {
    if (!selectedId || hasAnswered) return;
    setHasAnswered(true);
  };

  const handleContinueQuiz = () => {
    if (!hasAnswered) return;
    if (isLastQuestion) {
      navigate("/trail");
    } else {
      setQuizIndex((prev) => prev + 1);
      setSelectedId(null);
      setHasAnswered(false);
    }
  };

  const MascotComponent = mode === "quiz" ? currentQuestion.mascot : currentSlide.mascot;

  return {
    module: MODULE_1,
    mode,
    setMode,
    slideIndex,
    phase,
    bubbleText,
    isTyping,
    quizIndex,
    selectedId,
    hasAnswered,
    currentSlide,
    isLastSlide,
    currentQuestion,
    isLastQuestion,
    progressValue,
    MascotComponent,
    handleBack,
    handleContinueLearning,
    handleChatMessage,
    handleSelectQuizOption,
    handleConfirmQuiz,
    handleContinueQuiz,
  };
}
