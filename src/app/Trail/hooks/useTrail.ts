import { useCallback, useEffect, useState } from "react";
import { getTrail } from "../services/trailApi";
import type { TrailData } from "../types/types";

const LOAD_ERROR = "Não foi possível carregar a trilha.";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : LOAD_ERROR;
}

export function useTrail() {
  const [trail, setTrail] = useState<TrailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getTrail()
      .then((data) => {
        if (active) setTrail(data);
      })
      .catch((err: unknown) => {
        if (active) setError(errorMessage(err));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setTrail(await getTrail());
    } catch (err: unknown) {
      setError(errorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { trail, isLoading, error, reload };
}
