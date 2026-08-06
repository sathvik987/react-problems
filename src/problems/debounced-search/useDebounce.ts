import { useEffect, useState } from "react";

/**
 * ---------------------------------------------------------------------------
 * TASK: Implement `useDebounce`.
 *
 * Given a value that changes rapidly (e.g. on every keystroke) and a delay in
 * milliseconds, return a debounced copy of that value: one that only updates
 * after the input has stopped changing for `delayMs`.
 *
 * Requirements:
 *   - Must work for any value type (string, number, object, ...) — keep it
 *     generic.
 *   - Must cancel the pending timer if `value` (or `delayMs`) changes again
 *     before `delayMs` elapses. Otherwise a stale timer from an earlier
 *     keystroke can fire late and stomp on a newer one.
 *   - Must clean up on unmount too (same mechanism as above).
 * ---------------------------------------------------------------------------
 */
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
