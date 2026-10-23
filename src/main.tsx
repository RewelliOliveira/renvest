import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { IconContext } from "@phosphor-icons/react";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GOOGLE_CLIENT_ID, isGoogleAuthEnabled } from "./lib/googleAuth";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <IconContext.Provider value={{ weight: "bold" }}>
        {isGoogleAuthEnabled ? (
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        ) : (
          <App />
        )}
      </IconContext.Provider>
    </ErrorBoundary>
  </StrictMode>
);
