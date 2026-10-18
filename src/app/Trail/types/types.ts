export type NodeStatus = "completed" | "current" | "locked";

export interface SourceRef {
  document: string;
  section: string;
  institution?: string | null;
  url?: string | null;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface LessonNode {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  status: NodeStatus;
}

export interface ExamNode {
  status: NodeStatus;
  question_count: number;
  pass_score: number;
  attempts: number;
  best_score: number | null;
}

export interface TrailModule {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  status: NodeStatus;
  lessons: LessonNode[];
  exam: ExamNode;
}

export interface Streak {
  current_days: number;
  active_today: boolean;
}

export interface TrailData {
  modules: TrailModule[];
  streak: Streak;
  progress: {
    completed_lessons: number;
    total_lessons: number;
    completed_modules: number;
    total_modules: number;
  };
  current_module_id: string | null;
  completed: boolean;
}

export type TrailNodeItem =
  | { kind: "lesson"; key: string; module: TrailModule; lesson: LessonNode; status: NodeStatus; positionX: number }
  | { kind: "exam"; key: string; module: TrailModule; exam: ExamNode; status: NodeStatus; positionX: number };

export interface Question {
  id: string;
  question: string;
  options: QuestionOption[];
  correct_option: string;
  explanation: string;
  source: SourceRef;
}

export interface Slide {
  title: string;
  text: string;
  source?: SourceRef | null;
}

export interface LessonContent {
  id: string;
  module_id: string;
  title: string;
  subtitle: string;
  slides: Slide[];
  chat_suggestions: string[];
  quiz: Question[];
}

export interface ExamStart {
  attempt_id: string;
  module_id: string;
  pass_score: number;
  questions: Array<Omit<Question, "correct_option" | "explanation" | "source">>;
}

export interface ExamQuestionResult {
  question_id: string;
  question: string;
  options: QuestionOption[];
  selected_option: string | null;
  correct_option: string;
  is_correct: boolean;
  explanation: string;
  source: SourceRef;
}

export interface ExamResult {
  module_id: string;
  score: number;
  correct_count: number;
  total: number;
  passed: boolean;
  pass_score: number;
  results: ExamQuestionResult[];
  trail: TrailData;
}
