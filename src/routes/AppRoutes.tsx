import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/AuthLogin/hooks/useAuth";
import { getPostAuthRoute } from "@/lib/onboarding";

// Cada página vira um chunk próprio, carregado apenas quando a rota é acessada
const Login = lazy(() => import("@/app/AuthLogin/pages/Login").then((m) => ({ default: m.Login })));
const Register = lazy(() => import("@/app/AuthLogin/pages/Register").then((m) => ({ default: m.Register })));
const Home = lazy(() => import("@/app/Home/pages/Home").then((m) => ({ default: m.Home })));
const ChatMission = lazy(() => import("@/app/Chat/pages/ChatMission").then((m) => ({ default: m.ChatMission })));
const Chat = lazy(() => import("@/app/Chat/pages/Chat").then((m) => ({ default: m.Chat })));
const Profile = lazy(() => import("@/app/Profile/pages/Profile").then((m) => ({ default: m.Profile })));
const TrailProgress = lazy(() => import("@/app/Trail/pages/TrailProgress").then((m) => ({ default: m.TrailProgress })));
const Completion = lazy(() => import("@/app/Trail/pages/Completion").then((m) => ({ default: m.Completion })));
const ExamPage = lazy(() => import("@/app/Exam/pages/ExamPage").then((m) => ({ default: m.ExamPage })));

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07090E] text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        <p className="text-sm text-neutral-400">Carregando...</p>
      </div>
    </div>
  );
}

function RouteGuard({ isPrivate }: { isPrivate?: boolean }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isPrivate && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isPrivate && isAuthenticated) {
    return <Navigate to={getPostAuthRoute(user?.id)} replace />;
  }

  return <Outlet />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<RouteGuard />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<RouteGuard isPrivate />}>
            <Route path="/trail" element={<TrailProgress />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/perfil" element={<Navigate to="/profile" replace />} />
            <Route path="/lesson/:lessonId" element={<ChatMission />} />
            <Route path="/exam/:moduleId" element={<ExamPage />} />
            <Route path="/conclusao" element={<Completion />} />
            <Route path="/mission" element={<Navigate to="/trail" replace />} />
            <Route path="/progress" element={<Navigate to="/trail" replace />} />
            <Route path="/caminho" element={<Navigate to="/trail" replace />} />
            <Route path="/dashboard" element={<Navigate to="/trail" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Navigate to="/trail" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}