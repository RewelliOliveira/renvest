import type { ComponentType, SVGProps } from "react";

export interface LearningStep {
  id: number;
  mascot: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  bubbleText: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface SourceCitation {
  document: string;
  section: string;
}

export interface QuizStep {
  id: number;
  mascot: ComponentType<SVGProps<SVGSVGElement>>;
  question: string;
  explanation: string;
  source: SourceCitation;
  options: QuizOption[];
}

export interface MissionModule {
  id: string;
  title: string;
  learningSteps: LearningStep[];
  chatSuggestions: string[];
  quizSteps: QuizStep[];
}

export type MissionMode = "learning" | "quiz";
export type LearningPhase = "slides" | "free-chat";
