import { useReducer } from "react";

/**
 * ---------------------------------------------------------------------------
 * TASK: Fix `useUndoRedo`.
 *
 * A generic undo/redo hook built on `useReducer`. State is modelled as three
 * pieces — everything you've undone past, what you're looking at now, and
 * everything you could redo forward into:
 *
 *     past: [A, B]      present: C      future: [D, E]
 *            ↑ undo goes here            ↑ redo goes here
 *
 * undo() pops the tail of `past` into `present`, and pushes the old `present`
 * onto the head of `future`. redo() does the mirror image.
 *
 * Requirements:
 *   - undo()/redo() are no-ops at the ends — never crash, never produce
 *     `undefined` state.
 *   - A fresh edit after an undo discards the redo branch. You cannot redo
 *     into a timeline you've abandoned.
 *   - The reducer must be PURE: never mutate `state`, always return a new
 *     object. React calls reducers twice in StrictMode specifically to smoke
 *     out impure ones — a reducer that mutates gives different answers on the
 *     second call.
 *
 * There are three bugs below, one per `case`. The UI shows live `past`/
 * `future` depths — watch those counters while you click, they make two of
 * the three visible immediately.
 * ---------------------------------------------------------------------------
 */

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export type HistoryAction<T> =
  { type: "set"; value: T } | { type: "undo" } | { type: "redo" };

export interface UseUndoRedoReturn<T> {
  state: T;
  set: (value: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  undoDepth: number;
  redoDepth: number;
}

function historyReducer<T>(
  state: HistoryState<T>,
  action: HistoryAction<T>,
): HistoryState<T> {
  switch (action.type) {
    case "set": {
      return {
        past: [...state.past, state.present],
        present: action.value,
        future: [],
      };
    }

    case "undo": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }

    case "redo": {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return {
        past: [...state.past, state.present],
        present: next,
        future: rest,
      };
    }
  }
}

export function useUndoRedo<T>(initial: T): UseUndoRedoReturn<T> {
  const [state, dispatch] = useReducer(historyReducer<T>, {
    past: [],
    present: initial,
    future: [],
  });

  // Derived, not stored — these can never drift out of sync with the history
  // they describe. This part is already correct, leave it alone.
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  return {
    state: state.present,
    set: (value: T) => dispatch({ type: "set", value }),
    undo: () => dispatch({ type: "undo" }),
    redo: () => dispatch({ type: "redo" }),
    canUndo,
    canRedo,
    undoDepth: state.past.length,
    redoDepth: state.future.length,
  };
}
