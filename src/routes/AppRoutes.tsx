import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/AuthLogin/hooks/useAuth";
import { Login } from "@/app/AuthLogin/pages/Login";
import { Register } from "@/app/AuthLogin/pages/Register";
import { Home } from "@/app/Home/pages/Home";
import { ChatMission } from "@/app/Chat/pages/ChatMission";
import { Chat } from "@/app/Chat/pages/Chat";
import { Profile } from "@/app/Profile/pages/Profile";
import { TrailProgress } from "@/app/Trail/pages/TrailProgress";

function RouteGuard({ isPrivate }: { isPrivate?: boolean }) {
  const { isAuthenticated } = useAuth();

  if (isPrivate && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isPrivate && isAuthenticated) {
    return <Navigate to="/trail" replace />;
  }

  return <Outlet />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
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
          <Route path="/mission" element={<ChatMission />} />
          <Route path="/progress" element={<Navigate to="/trail" replace />} />
          <Route path="/caminho" element={<Navigate to="/trail" replace />} />
          <Route path="/dashboard" element={<Navigate to="/trail" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate to="/trail" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
