import { lazy } from "react";

const loadTrail = () => import("@/app/Trail/pages/TrailProgress");
const loadChat = () => import("@/app/Chat/pages/Chat");
const loadProfile = () => import("@/app/Profile/pages/Profile");

export const Login = lazy(() =>
  import("@/app/AuthLogin/pages/Login").then((m) => ({ default: m.Login })),
);
export const Register = lazy(() =>
  import("@/app/AuthLogin/pages/Register").then((m) => ({
    default: m.Register,
  })),
);
export const Home = lazy(() =>
  import("@/app/Home/pages/Home").then((m) => ({ default: m.Home })),
);
export const ChatMission = lazy(() =>
  import("@/app/Chat/pages/ChatMission").then((m) => ({
    default: m.ChatMission,
  })),
);
export const Chat = lazy(() => loadChat().then((m) => ({ default: m.Chat })));
export const Profile = lazy(() =>
  loadProfile().then((m) => ({ default: m.Profile })),
);
export const PrivacySecurity = lazy(() =>
  import("@/app/Profile/pages/PrivacySecurity").then((m) => ({
    default: m.PrivacySecurity,
  })),
);
export const About = lazy(() =>
  import("@/app/Profile/pages/About").then((m) => ({ default: m.About })),
);
export const TrailProgress = lazy(() =>
  loadTrail().then((m) => ({ default: m.TrailProgress })),
);
export const Completion = lazy(() =>
  import("@/app/Trail/pages/Completion").then((m) => ({
    default: m.Completion,
  })),
);
export const ExamPage = lazy(() =>
  import("@/app/Exam/pages/ExamPage").then((m) => ({ default: m.ExamPage })),
);

export function preloadTabPages(): void {
  void Promise.all([loadTrail(), loadChat(), loadProfile()]);
}
