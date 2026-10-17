import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useChatMission } from "../hooks/useChatMission";
import { MissionHeader } from "../components/MissionHeader";
import { LearningView } from "../components/LearningView";
import { QuizView } from "../components/QuizView";
import { MissionFooter } from "../components/MissionFooter";

function LessonScreen({ lessonId }: { lessonId: string }) {
  const navigate = useNavigate();
  const {
    lesson,
    loadError,
    mode,
    slideIndex,
    phase,
    bubbleText,
    bubbleSource,
    isTyping,
    attemptCount,
    quizSteps,
    correctCount,
    isCorrectAnswer,
    isRetry,
    correctOptionText,
    selectedId,
    hasAnswered,
    currentQuestion,
    isLastQuestion,
    progressValue,
    MascotComponent,
    isFinishing,
    finishError,
    handleBack,
    handleContinueLearning,
    handleChatMessage,
    handleStartQuiz,
    handleSelectQuizOption,
    handleConfirmQuiz,
    handleContinueQuiz,
  } = useChatMission(lessonId);

  if (loadError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 px-4">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-sm text-neutral-200">{loadError}</p>
        <button
          type="button"
          onClick={() => navigate("/trail")}
          className="mt-2 px-5 py-2.5 rounded-xl bg-red text-white font-bold text-sm cursor-pointer hover:brightness-105"
        >
          Voltar para a trilha
        </button>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-red border-t-transparent" />
        <p className="text-sm text-neutral-400">Preparando a lição...</p>
      </div>
    );
  }

  return (
    <>
      <MissionHeader
        progressValue={progressValue}
        mode={mode}
        counterLabel={`${correctCount}/${quizSteps.length}`}
        onBack={handleBack}
      />

      {mode === "learning" && (
        <LearningView
          slideIndex={slideIndex}
          phase={phase}
          bubbleText={bubbleText}
          source={bubbleSource}
          isTyping={isTyping}
          MascotComponent={MascotComponent}
        />
      )}

      {mode === "quiz" && currentQuestion && (
        <QuizView
          attemptKey={attemptCount}
          isRetry={isRetry}
          currentQuestion={currentQuestion}
          selectedId={selectedId}
          hasAnswered={hasAnswered}
          MascotComponent={MascotComponent}
          onSelectOption={handleSelectQuizOption}
        />
      )}

      {finishError && (
        <p className="text-xs text-red-300 text-center pb-1" role="alert">
          {finishError}
        </p>
      )}

      <MissionFooter
        mode={mode}
        phase={phase}
        chatSuggestions={lesson.chat_suggestions}
        isTyping={isTyping}
        selectedId={selectedId}
        hasAnswered={hasAnswered}
        isLastQuestion={isLastQuestion}
        isCorrectAnswer={isCorrectAnswer}
        correctOptionText={correctOptionText}
        isFinishing={isFinishing}
        onChatMessage={handleChatMessage}
        onStartQuiz={handleStartQuiz}
        onContinueLearning={handleContinueLearning}
        onConfirmQuiz={handleConfirmQuiz}
        onContinueQuiz={handleContinueQuiz}
      />
    </>
  );
}

export function ChatMission() {
  const { lessonId = "" } = useParams();

  return (
    <div className="h-dvh max-h-dvh w-full overflow-hidden select-none bg-linear-to-b from-[#000815] via-[#00050d] to-[#000000] flex flex-col items-center px-4 sm:px-6 py-4 sm:py-6">
      <div className="w-full max-w-sm sm:max-w-md flex flex-col justify-between h-full">
        {/* key reinicia o estado ao trocar de lição */}
        <LessonScreen key={lessonId} lessonId={lessonId} />
      </div>
    </div>
  );
}
