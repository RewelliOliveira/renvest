import { apiRequest } from "@/lib/api";
import type { ExamResult, ExamStart, LessonContent, TrailData } from "../types/types";

export function getTrail(): Promise<TrailData> {
  return apiRequest("/trail", {
    method: "GET",
    auth: true,
    fallbackError: "Não foi possível carregar a trilha. Tente novamente.",
  });
}

export function getLesson(lessonId: string): Promise<LessonContent> {
  return apiRequest(`/lessons/${encodeURIComponent(lessonId)}`, {
    method: "GET",
    auth: true,
    fallbackError: "Não foi possível carregar a lição.",
  });
}

export function completeLesson(lessonId: string): Promise<TrailData> {
  return apiRequest(`/lessons/${encodeURIComponent(lessonId)}/complete`, {
    method: "POST",
    auth: true,
    fallbackError: "Não foi possível registrar a conclusão da lição.",
  });
}

export function startExam(moduleId: string): Promise<ExamStart> {
  return apiRequest(`/modules/${encodeURIComponent(moduleId)}/exam`, {
    method: "POST",
    auth: true,
    fallbackError: "Não foi possível iniciar o teste final.",
  });
}

export function submitExam(attemptId: string, answers: Record<string, string>): Promise<ExamResult> {
  return apiRequest(`/exam-attempts/${encodeURIComponent(attemptId)}/submit`, {
    method: "POST",
    auth: true,
    body: { answers },
    fallbackError: "Não foi possível enviar as respostas do teste.",
  });
}
