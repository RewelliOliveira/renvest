import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/AuthLogin/hooks/useAuth";
import { Login } from "@/app/AuthLogin/pages/Login";
import { Register } from "@/app/AuthLogin/pages/Register";
import { Home } from "@/app/Home/pages/Home";

function RouteGuard({ isPrivate }: { isPrivate?: boolean }) {
  const { isAuthenticated } = useAuth();

  if (isPrivate && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isPrivate && isAuthenticated) {
    return <Navigate to="/home" replace />;
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
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Navigate to="/home" replace />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
