import { useState } from "react";
import { EMPLOYEES } from "./employees";

/**
 * A searchable, sortable list.
 */

type SortKey = "name" | "role" | "department";

export function EmployeeDirectory() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");

  // Derived during render from `query` and `sortKey` — no second source of
  // truth, no effect to keep in step, no stale frame. `.filter()` already
  // returns a fresh array, so the `.sort()` below never touches `EMPLOYEES`.
  const visible = EMPLOYEES.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase()),
  ).sort((a, b) => a[sortKey].localeCompare(b[sortKey]));

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
        {visible.map((employee) => (
          <li key={employee.id}>
            <input type="checkbox" aria-label={`Select ${employee.name}`} />
            <span className="directory-name">{employee.name}</span>
            <span className="directory-meta">
              {employee.role} · {employee.department}
            </span>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="directory-empty">No matches</li>
        )}
      </ul>

      <p className="directory-newest">
        Newest hires:{" "}
        {EMPLOYEES.slice(-3)
          .map((e) => e.name)
          .join(", ")}
      </p>
    </div>
  );
}
