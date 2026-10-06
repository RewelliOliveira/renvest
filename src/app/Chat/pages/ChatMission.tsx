import { useChatMission } from "../hooks/useChatMission";
import { MissionHeader } from "../components/MissionHeader";
import { LearningView } from "../components/LearningView";
import { QuizView } from "../components/QuizView";
import { MissionFooter } from "../components/MissionFooter";

export function ChatMission() {
  const {
    module,
    mode,
    setMode,
    slideIndex,
    phase,
    bubbleText,
    isTyping,
    quizIndex,
    selectedId,
    hasAnswered,
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
  } = useChatMission();

  return (
    <div className="h-dvh max-h-dvh w-full overflow-hidden select-none bg-linear-to-b from-[#000815] via-[#00050d] to-[#000000] flex flex-col items-center px-4 sm:px-6 py-4 sm:py-6">
      <div className="w-full max-w-sm sm:max-w-md flex flex-col justify-between h-full">
        <MissionHeader
          progressValue={progressValue}
          mode={mode}
          currentQuestionIndex={quizIndex}
          totalQuestions={module.quizSteps.length}
          onBack={handleBack}
        />

        {mode === "learning" && (
          <LearningView
            slideIndex={slideIndex}
            phase={phase}
            bubbleText={bubbleText}
            isTyping={isTyping}
            MascotComponent={MascotComponent}
          />
        )}

        {mode === "quiz" && (
          <QuizView
            quizIndex={quizIndex}
            currentQuestion={currentQuestion}
            selectedId={selectedId}
            hasAnswered={hasAnswered}
            MascotComponent={MascotComponent}
            onSelectOption={handleSelectQuizOption}
          />
        )}

        <MissionFooter
          mode={mode}
          phase={phase}
          chatSuggestions={module.chatSuggestions}
          isTyping={isTyping}
          selectedId={selectedId}
          hasAnswered={hasAnswered}
          isLastQuestion={isLastQuestion}
          onChatMessage={handleChatMessage}
          onStartQuiz={() => setMode("quiz")}
          onContinueLearning={handleContinueLearning}
          onConfirmQuiz={handleConfirmQuiz}
          onContinueQuiz={handleContinueQuiz}
        />
      </div>
    </div>
  );
}
