import { useState } from "react";
import { Login } from "./app/AuthLogin/pages/Login";
import { Register } from "./app/AuthLogin/pages/Register";

function App() {
  const [currentPage, setCurrentPage] = useState<"login" | "register">("login");

  if (currentPage === "register") {
    return <Register onNavigateToLogin={() => setCurrentPage("login")} />;
  }

  return <Login onNavigateToRegister={() => setCurrentPage("register")} />;
}

export default App;
