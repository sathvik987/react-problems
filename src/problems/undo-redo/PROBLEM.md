# 🧩 Interview Problem: Undo / Redo

A generic undo/redo hook built on `useReducer`, driving a todo list.

## What's given

- `useUndoRedo.ts` — the hook. Runs, but has three bugs (one per reducer case).
- `TodoEditor.tsx` — the UI. Complete. Holds no todo state of its own.

## The model

```
past: [A, B]      present: C      future: [D, E]
         ↑                            ↑
    undo pulls here             redo pulls here
```

## Expected behaviour

- `undo()` steps back through history, `redo()` steps forward again.
- A fresh edit after an undo **discards** the redo branch — you can't redo into
  a timeline you abandoned.
- `undo()` / `redo()` are no-ops at the ends. Never crash, never produce
  `undefined` state.
- The reducer is pure: same input, same output, every time. StrictMode calls it
  twice on purpose, and both calls must agree.

The "past N / future N" readout under the buttons is your debugger.

## The three bugs

1. **`set` keeps the redo branch.** Undo twice, make a new edit, hit Redo —
   you land in a state that never existed.
2. **`undo` has no floor.** With an empty `past`, `present` becomes
   `undefined` and the list render crashes.
3. **`redo` mutates state.** `.shift()` and `.push()` modify the arrays in
   place, so StrictMode's second call sees what the first one already chewed
   on — one click moves two steps.

## Run it

```bash
npm run dev        # http://localhost:5173/problems/undo-redo
npm run lint
npm run build
```

## Bonus

- Cap history at 50 entries.
- Coalesce rapid edits into one entry.
- Store *actions* instead of *snapshots* — when is each better?

---

Want the solution? Ask and I'll drop a completed version next to the stub.
