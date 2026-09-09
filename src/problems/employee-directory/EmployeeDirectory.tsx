import { useEffect, useState } from "react";
import { EMPLOYEES, type Employee } from "./employees";

/**
 * ---------------------------------------------------------------------------
 * TASK: Fix `EmployeeDirectory`.
 *
 * A searchable, sortable list. It works — mostly. There are three bugs, and
 * all three are things that show up in real codebases constantly. None of them
 * need a clever fix; two of them are fixed by *deleting* code.
 *
 * Notice what this problem does NOT have: a custom hook file. That's a hint.
 * ---------------------------------------------------------------------------
 */

type SortKey = "name" | "role" | "department";

export function EmployeeDirectory() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");

  // BUG 1. `visible` is not really state — it's a pure function of `query`
  // and `sortKey`, both of which are already state. Storing it means there
  // are now two sources of truth that have to be kept in step by hand, and
  // the effect below is that hand.
  const [visible, setVisible] = useState<Employee[]>(EMPLOYEES);

  useEffect(() => {
    // BUG 2. `.sort()` sorts IN PLACE and returns the same array. `EMPLOYEES`
    // is the shared module-level array, so this permanently reorders the
    // "database" for everyone. Scroll down to "Newest hires" — it reads
    // `EMPLOYEES` in insertion order. Click a sort button and watch it change.
    const next = EMPLOYEES.sort((a, b) =>
      a[sortKey].localeCompare(b[sortKey]),
    ).filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));

    // Also note: this render → effect → setState → render again round trip
    // means every keystroke paints one frame with the OLD list before
    // correcting itself. `npm run lint` has an opinion about this line.
    setVisible(next);
  }, [query, sortKey]);

  return (
    <div className="directory">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter by name…"
        aria-label="Filter by name"
      />

      <div className="directory-sort">
        {(["name", "role", "department"] as SortKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setSortKey(key)}
            disabled={sortKey === key}
          >
            Sort by {key}
          </button>
        ))}
      </div>

      <ul className="directory-list">
        {visible.map((employee, index) => (
          // BUG 3. `key={index}` ties React's identity to POSITION, not to the
          // employee. Tick a checkbox, then re-sort: the checkbox state stays
          // with the row number instead of following the person. (The
          // checkboxes are uncontrolled on purpose — their state lives in the
          // DOM node React is reusing, which is what makes this visible.)
          <li key={index}>
            <input type="checkbox" aria-label={`Select ${employee.name}`} />
            <span className="directory-name">{employee.name}</span>
            <span className="directory-meta">
              {employee.role} · {employee.department}
            </span>
          </li>
        ))}
        {visible.length === 0 && <li className="directory-empty">No matches</li>}
      </ul>

      <p className="directory-newest">
        Newest hires: {EMPLOYEES.slice(-3).map((e) => e.name).join(", ")}
      </p>
    </div>
  );
}
