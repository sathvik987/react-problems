# 🧩 Interview Problem: Debounced Search

Build a search box in React + TypeScript that debounces user input and stays
correct under a slow, variable-latency API.

## What's given (boilerplate)

- `useDebounce.ts` — a generic custom hook, **stubbed with `TODO`s**. Right
  now it returns `value` unchanged; it doesn't debounce anything.
- `mockApi.ts` — a fake search API with random 200ms-1200ms latency. Complete,
  don't need to touch it (but read it — the latency is the whole point).
- `SearchBox.tsx` — the UI, already wired to `useDebounce` and `searchItems`.

## Your job

1. **Implement `useDebounce`.** Schedule the value update after `delayMs`, and
   cancel the pending timer if `value` changes again first (or on unmount).
2. **Fix the race condition in `SearchBox.tsx`.** Because latency is random,
   responses can arrive out of order. Type "pa", then quickly "panda" — the
   slow response for "pa" can resolve *after* the fast response for "panda"
   and silently overwrite it with stale results.

   Fix it with either:
   - an `AbortController` per request (`searchItems` already accepts a
     `signal`), or
   - a ref/counter that tags each request and ignores any response that isn't
     from the latest one.

## The gotcha, explained

```ts
useEffect(() => {
  setIsLoading(true);
  searchItems(debouncedQuery).then((items) => {
    setResults(items);        // ❌ no check that this is still the latest request
    setIsLoading(false);
  });
}, [debouncedQuery]);
```

Every keystroke (after debouncing) fires a new request, but nothing stops an
older, slower request from resolving last and clobbering the newer result.
This is a very common real-world bug in type-ahead search, autocomplete, and
any "fetch on input change" UI — and a classic interview follow-up question
even after the debounce itself works.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 — works even before you solve it
npm run build      # runs `tsc -b` — fails right now (unused setter) until
                    # you actually call `setDebouncedValue`
```

To see the race condition happen, throttle yourself less than the API: type a
short query, then immediately extend it, and watch whether the results ever
regress back to the shorter query's matches.

---

When you want to check your solution against a reference, ask and I'll drop a
completed version next to the stub.
