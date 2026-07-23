import { useRef, useState } from "react";

/**
 * ---------------------------------------------------------------------------
 * TASK: Implement the `useStopwatch` custom hook.
 *
 * Requirements:
 *   - start():  begins counting up from wherever it's paused (no-op if already
 *               running).
 *   - pause():  freezes the elapsed time (no-op if not running).
 *   - reset():  stops and sets elapsed time back to 0.
 *   - The hook must expose the current elapsed time (in milliseconds) and
 *     whether the stopwatch is currently running.
 *
 * You may use setInterval (~10ms tick) OR requestAnimationFrame — your call.
 *
 * TYPESCRIPT: The types below are intentionally incomplete. Fill in the `TODO`
 * spots. Watch out for the interval ref type in particular — `@types/node` is
 * installed in this project, so `setInterval`'s return type is NOT `number`.
 * ---------------------------------------------------------------------------
 */

// TODO: describe the shape of what this hook returns to its consumer.
export interface UseStopwatchReturn {
  elapsedMs: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useStopwatch(): UseStopwatchReturn {
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // TODO: give this ref the correct type so it can hold the id returned by
  // setInterval AND the initial `null`. (Hint: `ReturnType<typeof setInterval>`)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(0);

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      startRef.current = Date.now() - elapsedMs;
      intervalRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startRef.current);
      }, 10);
    }
  };

  const pause = () => {
    // TODO: implement. Clear the interval and stop running.
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
  };

  const reset = () => {
    // TODO: implement. Stop and zero out elapsedMs.
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setElapsedMs(0);
  };

  // TODO: return the values/handlers the component needs.
  return {
    elapsedMs,
    isRunning,
    start,
    pause,
    reset,
  } as UseStopwatchReturn;
}
