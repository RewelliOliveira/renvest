import { MotionConfig } from "motion/react";
import { AuthProvider } from "./app/AuthLogin/context/AuthContext";
import { AppRoutes } from "./routes/AppRoutes";
import { useBouncyClick } from "./lib/useBouncyClick";

function App() {
  useBouncyClick();

  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MotionConfig>
  );
}

export default App;
