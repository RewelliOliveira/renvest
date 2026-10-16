import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/** Evita a tela em branco: um erro de renderização mostra uma mensagem com opção de recarregar. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erro não tratado na interface", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#07090E] px-6 text-white">
        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
          <h1 className="text-lg font-bold">Algo deu errado</h1>
          <p className="text-sm text-neutral-400">
            Não foi possível carregar esta tela. Tente recarregar a página.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="cursor-pointer rounded-xl border-b-4 border-red-dark bg-red px-6 py-3 font-bold text-white transition-all hover:brightness-105 active:translate-y-0.5 active:border-b-0"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }
}
