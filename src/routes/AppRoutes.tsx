import { Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "@/app/AuthLogin/hooks/useAuth";
import { getPostAuthRoute } from "@/lib/onboarding";
import { MascotLoader } from "@/components/ui/MascotLoader";
import { AppShell } from "@/components/layout/AppShell";
import {
  Login,
  Register,
  Home,
  ChatMission,
  Chat,
  Profile,
  PrivacySecurity,
  About,
  TrailProgress,
  Completion,
  ExamPage,
} from "./lazyPages";

function RouteGuard({ isPrivate }: { isPrivate?: boolean }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <MascotLoader />;
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
      <Suspense fallback={<MascotLoader />}>
        <Routes>
          <Route element={<RouteGuard />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<RouteGuard isPrivate />}>
            <Route element={<AppShell />}>
              <Route path="/trail" element={<TrailProgress />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/privacidade" element={<PrivacySecurity />} />
              <Route path="/profile/sobre" element={<About />} />
            </Route>
            <Route
              path="/perfil"
              element={<Navigate to="/profile" replace />}
            />
            <Route path="/lesson/:lessonId" element={<ChatMission />} />
            <Route path="/exam/:moduleId" element={<ExamPage />} />
            <Route path="/conclusao" element={<Completion />} />
            <Route path="/mission" element={<Navigate to="/trail" replace />} />
            <Route
              path="/progress"
              element={<Navigate to="/trail" replace />}
            />
            <Route path="/caminho" element={<Navigate to="/trail" replace />} />
            <Route
              path="/dashboard"
              element={<Navigate to="/trail" replace />}
            />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Navigate to="/trail" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
