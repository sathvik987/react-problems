# 🧩 Interview Problem: Searchable Directory

Filter and sort a list of employees. This is the easiest problem in the repo,
and probably the most likely one to actually come up — "here's a list, add
search and sorting" is a staple screening question, and the bugs below are the
ones interviewers are watching for.

## What's given (boilerplate)

- `employees.ts` — a static array of 8 employees. Complete, don't touch it.
- `EmployeeDirectory.tsx` — the component, **working but wrong in three ways**.

There is deliberately **no custom hook file** for this problem. That's a hint
about the first bug.

## Your job

Three bugs. Two of them are fixed by deleting code.

### 1. Derived state stored in `useState`

```tsx
const [visible, setVisible] = useState<Employee[]>(EMPLOYEES);

useEffect(() => {
  const next = /* filter + sort */;
  setVisible(next);
}, [query, sortKey]);
```

`visible` is not independent state. It is a pure function of `query` and
`sortKey`, both of which are *already* state. Storing it creates a second
source of truth that has to be manually kept in step — and that `useEffect` is
the manual keeping-in-step.

What it costs you:
- **An extra render every keystroke.** React renders with the stale list,
  *then* runs the effect, *then* re-renders with the right one. You are
  painting a frame of wrong data every single time.
- **A whole category of bugs.** Forget a dependency, or add a third filter and
  forget to update the effect, and the two sources of truth silently diverge.

The fix is to compute it during render:

```tsx
const visible = EMPLOYEES.filter(...).sort(...);
```

No `useState`, no `useEffect`, no stale frame, nothing to keep in sync. This
is the single most common unnecessary-effect in real React code — see
[You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).

`npm run lint` will flag this too: this repo runs `eslint-plugin-react-hooks`
v7, whose `set-state-in-effect` rule calls out the cascading render directly.

> "But isn't recomputing on every render slow?" For 8 rows, no — and for 8,000
> you'd reach for `useMemo`, which still isn't `useState` + `useEffect`. Being
> able to say that out loud is the point of the question.

### 2. `.sort()` mutates

```tsx
EMPLOYEES.sort((a, b) => ...).filter(...)
```

`Array.prototype.sort()` sorts **in place** and returns *the same array*. So
this doesn't sort a copy — it permanently reorders the shared module-level
`EMPLOYEES` array that the rest of the app reads.

The symptom is visible: the **"Newest hires"** line at the bottom reads
`EMPLOYEES.slice(-3)`, i.e. the last three in insertion order. It should
always read:

```
Newest hires: Zoe Bennett, Omar Haddad, Hana Kovac
```

Right now it never does — not even on first paint, because the effect runs on
mount and sorts by name before you've touched anything, so you get
`Priya Raman, Tomas Novak, Zoe Bennett` instead. Click through the sort
buttons and it keeps changing. You've corrupted shared data from inside a
render, and a part of the UI that has nothing to do with sorting is now lying.

That "something unrelated broke" quality is exactly why mutation bugs are
nasty in real codebases: the damage surfaces far from the code that caused it.

Fix: copy first — `[...EMPLOYEES].sort(...)` or `EMPLOYEES.toSorted(...)`.
Note that `.filter()` and `.map()` already return new arrays, so ordering
matters: filtering *before* sorting means you're sorting a fresh array anyway.

### 3. `key={index}`

```tsx
{visible.map((employee, index) => (
  <li key={index}>
```

Keys tell React which DOM node corresponds to which item across renders. With
`key={index}`, the identity is the *row position*, not the *person* — so when
the list reorders, React thinks "row 0 is still row 0, just with different
text" and reuses the same DOM node.

To see it: tick a checkbox, then click a different sort button. The tick stays
on the same **row number** instead of following the employee. (The checkboxes
are uncontrolled on purpose — their state lives in the DOM node React is
reusing, which is exactly what makes the bug visible. The same thing happens
to focus, text selection, and any child component state.)

Fix: `key={employee.id}` — a stable identity that belongs to the data.

Index keys are fine only when the list is append-only and never reorders,
filters, or deletes. This list does all three.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173/problems/employee-directory
npm run lint       # currently fails — that's bug 1
npm run build
```

## Follow-ups an interviewer would ask

- Make the sort direction toggle (asc/desc) when you click the active column.
- Add a "department" dropdown filter. Notice how little changes if you fixed
  bug 1 — and how much you'd have to touch if you hadn't.
- The filter is case-insensitive but exact-substring. What would you change for
  "fuzzy" matching, and how would you keep it fast?
- When *would* you reach for `useMemo` here, and how would you know?

---

When you want to check your solution against a reference, ask and I'll drop a
completed version next to the stub.
