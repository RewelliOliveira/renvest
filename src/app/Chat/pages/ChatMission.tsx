import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { MascotLoader } from "@/components/ui/MascotLoader";
import { useAvatar } from "@/lib/avatar";
import { useQuizKeyboard } from "@/lib/useQuizKeyboard";
import { ImmersiveLayout } from "@/components/layout/ImmersiveLayout";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useChatMission } from "../hooks/useChatMission";
import { MissionHeader } from "../components/MissionHeader";
import { LearningView } from "../components/LearningView";
import { QuizView } from "../components/QuizView";
import { MissionFooter } from "../components/MissionFooter";
import { LessonComplete } from "../components/LessonComplete";

function LessonScreen({ lessonId }: { lessonId: string }) {
  const navigate = useNavigate();
  const [avatar] = useAvatar();
  const {
    lesson,
    loadError,
    mode,
    slideIndex,
    phase,
    bubbleText,
    isShowingReply,
    isTyping,
    attemptCount,
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
  } = useChatMission(lessonId);
  const [isLeaving, setIsLeaving] = useState(false);

  const hasProgress = mode === "quiz" || phase === "free-chat" || slideIndex > 0;
  const leaveLesson = () => navigate("/trail");
  const handleClose = () => (hasProgress ? setIsLeaving(true) : leaveLesson());

  useQuizKeyboard({
    optionCount: mode === "quiz" && !hasAnswered ? (currentQuestion?.options.length ?? 0) : 0,
    onSelect: (index) => {
      const option = currentQuestion?.options[index];
      if (option) handleSelectQuizOption(option.id);
    },
    onEnter: () => {
      if (completion) {
        handleFinish();
      } else if (mode === "quiz") {
        if (hasAnswered) void handleContinueQuiz();
        else handleConfirmQuiz();
      } else if (!isTyping) {
        if (phase === "slides") handleContinueLearning();
        else handleStartQuiz();
      }
    },
    enabled: !!lesson && !isFinishing && !isLeaving,
  });

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
    return <MascotLoader title="Preparando sua lição" />;
  }

  if (completion) {
    return (
      <LessonComplete
        lessonTitle={lesson.title}
        firstTryCorrect={completion.firstTryCorrect}
        total={completion.total}
        streak={completion.streak}
        mascotVariant={avatar}
        onContinue={handleFinish}
      />
    );
  }

  return (
    <>
      <MissionHeader
        progressValue={progressValue}
        onBack={handleBack}
        onClose={handleClose}
      />

      {mode === "learning" && (
        <LearningView
          slideIndex={slideIndex}
          phase={phase}
          bubbleText={bubbleText}
          isShowingReply={isShowingReply}
          isTyping={isTyping}
          MascotComponent={MascotComponent}
          mascotVariant={avatar}
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
          mascotVariant={avatar}
          onSelectOption={handleSelectQuizOption}
        />
      )}

      {finishError && (
        <p className="text-xs text-red-300 text-center pb-1 lg:pt-2" role="alert">
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
        isFinishing={isFinishing}
        onChatMessage={handleChatMessage}
        onStartQuiz={handleStartQuiz}
        onContinueLearning={handleContinueLearning}
        onConfirmQuiz={handleConfirmQuiz}
        onContinueQuiz={handleContinueQuiz}
      />

      <ConfirmDialog
        open={isLeaving}
        title="Sair da lição?"
        description="Se sair agora, você perde o progresso desta lição e vai precisar começar de novo."
        cancelLabel="Continuar estudando"
        confirmLabel="Sair da lição"
        onCancel={() => setIsLeaving(false)}
        onConfirm={leaveLesson}
      />
    </>
  );
}

export function ChatMission() {
  const { lessonId = "" } = useParams();

  return (
    <ImmersiveLayout>
      {/* key reinicia o estado ao trocar de lição */}
      <LessonScreen key={lessonId} lessonId={lessonId} />
    </ImmersiveLayout>
  );
}
