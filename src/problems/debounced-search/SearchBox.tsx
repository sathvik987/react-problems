import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";
import { searchItems } from "./mockApi";

/**
 * TASK: This component calls `useDebounce` and fetches results on every
 * debounced query change — but it has a race condition. The mock API has
 * random latency, so responses can arrive out of order: type "pa", then
 * quickly "panda", and the (slower) response for "pa" can land AFTER the
 * (faster) response for "panda" and overwrite it with stale results.
 *
 * Fix the race condition using either:
 *   (a) an AbortController per request (`searchItems` accepts a `signal`), or
 *   (b) a ref/counter that tags each request and ignores stale responses.
 *
 * Note: you'll also need to finish `useDebounce.ts` first — right now it
 * doesn't debounce anything, so every keystroke fires a request.
 */
export function SearchBox() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<string[]>([]);
  const [resolvedQuery, setResolvedQuery] = useState<string | null>(null);
  const isLoading = resolvedQuery !== debouncedQuery;

  useEffect(() => {
    const controller = new AbortController();

    searchItems(debouncedQuery, controller.signal)
      .then((items) => {
        setResults(items);
        setResolvedQuery(debouncedQuery);
      })
      .catch((err) => {
        if (err.name !== "AbortError") throw err;
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  return (
    <div className="search-box">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search animals..."
        aria-label="Search"
      />
      {isLoading && <p className="search-status">Searching…</p>}
      <ul className="search-results">
        {results.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
