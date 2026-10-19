import { useCallback, useEffect, useSyncExternalStore } from "react";
import { getTrail } from "../services/trailApi";
import type { TrailData } from "../types/types";

const LOAD_ERROR = "Não foi possível carregar a trilha.";

interface TrailState {
  trail: TrailData | null;
  isFetching: boolean;
  error: string | null;
}

const INITIAL_STATE: TrailState = { trail: null, isFetching: false, error: null };

let state = INITIAL_STATE;
let generation = 0;
let pending: Promise<void> | null = null;
const listeners = new Set<() => void>();

function setState(next: Partial<TrailState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : LOAD_ERROR;
}

function fetchTrail(): Promise<void> {
  if (pending) return pending;
  const requestGeneration = generation;
  setState({ isFetching: true });
  pending = getTrail()
    .then((trail) => {
      if (requestGeneration === generation) setState({ trail, error: null });
    })
    .catch((err: unknown) => {
      if (requestGeneration === generation) setState({ error: errorMessage(err) });
    })
    .finally(() => {
      pending = null;
      if (requestGeneration === generation) setState({ isFetching: false });
    });
  return pending;
}

export function setTrailData(trail: TrailData) {
  setState({ trail, error: null });
}

export function clearTrailData() {
  generation += 1;
  pending = null;
  setState(INITIAL_STATE);
}

export function useTrail() {
  const { trail, isFetching, error } = useSyncExternalStore(subscribe, () => state);

  useEffect(() => {
    void fetchTrail();
  }, []);

  const reload = useCallback(() => fetchTrail(), []);

  return { trail, isLoading: isFetching || (!trail && !error), error, reload };
}
