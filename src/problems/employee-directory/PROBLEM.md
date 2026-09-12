# 🧩 Interview Problem: Searchable Directory

Filter and sort a list of employees.

## What's given

- `employees.ts` — static data. Don't touch it.
- `EmployeeDirectory.tsx` — the component. Runs, but has three bugs.

## Expected behaviour

- Typing in the box filters the list by name, case-insensitively.
- Clicking a sort button reorders the list by that field.
- Ticking a row's checkbox, then re-sorting, keeps the tick on that **person**
  — not on that row position.
- The "Newest hires" line always reads `Zoe Bennett, Omar Haddad, Hana Kovac`,
  no matter what you filter or sort.
- No wasted renders: one render per interaction, never a frame of stale data.

## The three bugs

1. **`visible` is derived state.** It's kept in `useState` and re-synced by a
   `useEffect`, even though it's a pure function of `query` and `sortKey`.
2. **`.sort()` mutates.** It reorders the shared module-level `EMPLOYEES`
   array in place, which is why "Newest hires" is wrong.
3. **`key={index}`.** Row identity is tied to position instead of to the
   employee, so DOM state doesn't follow the data across a reorder.

## Run it

```bash
npm run dev        # http://localhost:5173/problems/employee-directory
npm run lint       # currently fails — that's bug 1
npm run build
```

---

Want the solution? Ask and I'll drop a completed version next to the stub.
