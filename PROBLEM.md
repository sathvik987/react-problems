# 🧩 Interview Problem: Stopwatch

Build a stopwatch in React + TypeScript with **Start**, **Pause**, and **Reset**.

## What's given (boilerplate)

- `src/hooks/useStopwatch.ts` — a custom hook, **partially stubbed with `TODO`s**.
- `src/components/Stopwatch.tsx` — the UI, already wired to the hook's API.
- `src/App.tsx` — renders `<Stopwatch />`.

## Your job

Complete `useStopwatch.ts` so the app works. That means:

1. **Fill in the `UseStopwatchReturn` interface** — what does the hook hand back?
2. **Type the interval ref correctly.** ⚠️ This is the trap. `@types/node` is
   installed, so `setInterval` returns `NodeJS.Timeout`, **not** `number`. Using
   `useRef<number | null>(null)` will fight you. Use `ReturnType<typeof setInterval>`.
3. **Implement `start` / `pause` / `reset`** with correct running-state guards.
4. (Bonus) Format the display as `mm:ss.cc` in `Stopwatch.tsx`.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # runs `tsc -b` — this is what fails if your types are wrong
```

`npm run dev` (Vite) does **not** type-check, so the app can "work" while your
types are still broken. Run `npm run build` (or `npx tsc -b --noEmit`) to catch
the TypeScript errors the interviewer cared about.

## The TypeScript gotcha, explained

```ts
const id = setInterval(fn, 10);
//    ^? number in a plain browser... but NodeJS.Timeout here, because
//       @types/node is in devDependencies and pulls in Node's overload.

useRef<number | null>(null);              // ❌ id isn't assignable to number
useRef<ReturnType<typeof setInterval>>(); // ✅ portable, always correct
```

If your interval ref is typed wrong, `intervalRef.current = setInterval(...)`
throws `Type 'Timeout' is not assignable to type 'number'`. That's almost
certainly the error that got you.

---

When you want to check your solution against a reference, ask and I'll drop a
completed version next to the stub.
