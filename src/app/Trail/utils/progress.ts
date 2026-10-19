import type { TrailModule } from "../types/types";

export function moduleProgress(module: TrailModule): number {
  const steps = module.lessons.length + 1;
  const done =
    module.lessons.filter((lesson) => lesson.status === "completed").length +
    (module.exam.status === "completed" ? 1 : 0);
  return done / steps;
}
