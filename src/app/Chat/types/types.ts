import type { ComponentType } from "react";
import type { MascotVariant } from "@/assets/mascotPalettes";

export type MascotComponentType = ComponentType<{ className?: string; variant?: MascotVariant }>;

export interface LearningStep {
  id: number;
  mascot: MascotComponentType;
  title: string;
  bubbleText: string;
  source?: SourceCitation | null;
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
  id: string;
  mascot: MascotComponentType;
  question: string;
  explanation: string;
  source: SourceCitation;
  options: QuizOption[];
}

export type MissionMode = "learning" | "quiz";
export type LearningPhase = "slides" | "free-chat";

export interface ChatSource {
  document: string;
  section: string;
  institution?: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  source?: ChatSource;
}

export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

export interface ChatApiResponse {
  reply: string;
  source?: ChatSource;
  suggestions: string[];
}

export interface SuggestionsApiResponse {
  module: string;
  suggestions: string[];
}
