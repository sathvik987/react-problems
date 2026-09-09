# 🧩 Interview Problem: Undo / Redo

Build a generic undo/redo hook on `useReducer`, and drive a todo list with it.

## What's given (boilerplate)

- `useUndoRedo.ts` — the hook, **implemented but broken**. Three bugs, one per
  reducer `case`.
- `TodoEditor.tsx` — the UI, complete. Holds no todo state of its own; the
  whole todo array *is* the hook's `present`.

## The model

History is three fields. That's the whole idea, and it's worth being able to
draw it on a whiteboard:

```
past: [A, B]        present: C        future: [D, E]
         ↑                                ↑
    undo pulls from here          redo pulls from here
```

- **undo()** — pop the tail of `past` into `present`, push the old `present`
  onto the *head* of `future`.
- **redo()** — the mirror image: shift the head of `future` into `present`,
  push the old `present` onto the *tail* of `past`.
- **set(v)** — archive `present` into `past`, make `v` the new `present`, and
  **throw the future away**.

## Your job

Fix all three cases in `historyReducer`.

1. **`set` keeps the redo branch alive.** Undo twice, type a new todo, then hit
   Redo — you'll jump into a timeline that no longer exists, because those
   future entries were built on a `present` you just overwrote. A new edit
   forks history; the abandoned branch has to be dropped.

2. **`undo` has no floor.** When `past` is empty, `state.past[-1]` is
   `undefined`, so `present` becomes `undefined`, and `TodoEditor.tsx` calls
   `.map()` on it and takes the whole page down. (`canUndo` disables the
   button, so you'll need to dispatch `undo` some other way to see it —
   which is exactly why guarding in the reducer matters and guarding in the
   UI doesn't. The reducer is the thing that has to be total.)

3. **`redo` mutates state.** `.shift()` and `.push()` both modify the arrays
   hanging off `state` in place. The `{ ...state }` spread at the end makes a
   fresh top-level object, so React re-renders and it *looks* fine — but the
   arrays inside are shared and already damaged.

## The purity gotcha, explained

Bug #3 is the one worth really understanding, because the symptom looks
nothing like the cause.

React calls reducers **twice** in StrictMode (dev only), deliberately, to
expose impure ones. A pure reducer returns the same answer both times. This
one doesn't:

```
start:  past=[A,B]  present=C  future=[D,E]      ← one Redo click

call 1: shift() → next=D, future=[E]
        push()  → past=[A,B,C]                   returns present=D

call 2: sees the arrays call 1 already mutated
        shift() → next=E, future=[]
        push()  → past=[A,B,C,C]                 returns present=E

result: one click jumped C → E. D was skipped entirely,
        the whole future got eaten, and past has a duplicate C.
```

You clicked Redo once and moved two steps. Note the failure mode: it's not a
crash, it's *silently wrong state*, and it only reproduces in dev. Ship the
mutation and it "works" in prod until two renders happen to overlap.

The fix is never to touch `state`: `state.future.slice(1)` instead of
`.shift()`, `[...state.past, state.present]` instead of `.push()`.

## Why `canUndo` / `canRedo` are derived

```ts
const canUndo = state.past.length > 0;   // ✅ derived every render
```

Not `useState`. There is no sequence of dispatches that can leave these
disagreeing with the history they describe, because they *are* the history.
Same reasoning as the derived `isLoading` in the infinite-scroll problem.

## Bonus

Once it works, try the follow-ups an interviewer would actually reach for:

- **Cap the history.** Keep at most 50 entries so a long session doesn't grow
  `past` without bound. (Watch the off-by-one at the boundary.)
- **Coalesce rapid edits.** Toggling five checkboxes creates five history
  entries. Real editors merge edits within a short window into one.
- **`useUndoRedo` currently snapshots whole arrays.** What changes if you store
  *actions* (a diff/command log) instead of *snapshots*? When is each better?

## Run it

```bash
npm install
npm run dev        # http://localhost:5173/problems/undo-redo
npm run lint
npm run build
```

The "past N / future N" readout under the buttons is your debugger — it makes
bugs #1 and #3 visible in a couple of clicks.

---

When you want to check your solution against a reference, ask and I'll drop a
completed version next to the stub.
