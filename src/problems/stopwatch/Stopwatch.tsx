import { useStopwatch } from "./useStopwatch";

/**
 * TASK: Wire the `useStopwatch` hook up to this UI.
 *   - Show the elapsed time formatted as mm:ss.cc (cc = centiseconds).
 *   - Wire Start / Pause / Reset buttons to the hook.
 *   - Bonus: disable Start while running, disable Pause while stopped, etc.
 */

function formatTime(ms: number): string {
  const totalCentiseconds = Math.floor(ms / 10);
  const centiseconds = totalCentiseconds % 100;
  const totalSeconds = Math.floor(totalCentiseconds / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  const pad = (n: number, width = 2) => String(n).padStart(width, "0");

  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}

export function Stopwatch() {
  const { elapsedMs, isRunning, start, pause, reset } = useStopwatch();

  return (
    <div className="stopwatch">
      <div className="counter" aria-live="polite">
        {formatTime(elapsedMs)}
      </div>

      <div className="stopwatch-controls">
        <button onClick={start} disabled={isRunning}>
          Start
        </button>
        <button onClick={pause} disabled={!isRunning}>
          Pause
        </button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
