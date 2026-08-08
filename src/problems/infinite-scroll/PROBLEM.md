# 🧩 Interview Problem: Infinite Scroll

Build an infinite-scrolling feed in React + TypeScript that loads the next page
when the bottom of the list comes into view.

## What's given (boilerplate)

- `mockFeed.ts` — a fake paginated API (8 posts/page, 40 total, random
  400ms–1000ms latency). Complete, don't touch it.
- `useInfiniteScroll.ts` — the hook, **implemented but broken**. It runs, and
  it visibly misbehaves.
- `Feed.tsx` — the UI, already wired to the hook.

## Your job

Fix `useInfiniteScroll.ts`. There are three distinct bugs stacked on top of
each other, and they're worth naming separately:

1. **Stale closure.** The `IntersectionObserver` callback is created once
   (`[]` deps) and captures `page` from the first render. It calls
   `setPage(page + 1)` — but `page` is permanently `1`, so it computes `2`
   forever. You scroll, it fetches page 2, appends it, and never gets any
   further.
2. **No cleanup.** Nothing calls `observer.disconnect()`. Every effect re-run
   leaks another live observer, and because `<StrictMode>` is on in
   `main.tsx`, you start with two before you've scrolled at all.
3. **Unguarded fetch.** Effect A has no `AbortSignal`, so a response for an
   abandoned page still resolves and appends. You'll see this immediately:
   StrictMode double-invokes the mount effect, both page-1 requests resolve,
   and React starts screaming about duplicate `key`s.

A fourth thing isn't a bug yet, but becomes one the moment you fix #1:
`observer.observe(sentinelRef.current!)`. That `!` holds today only because
the effect never re-runs. Give it real deps and it will re-run after `hasMore`
flips false — at which point `Feed.tsx` has stopped rendering the sentinel,
`current` is `null`, and `observe(null)` throws.

Then the follow-up an interviewer will actually ask:

**The sentinel can still be visible after a page lands.** Eight short posts may
not push it off a tall screen. Make that fire exactly one more request, not a
burst that skips from page 2 to page 5.

## The gotcha, explained

```ts
useEffect(() => {
  const observer = new IntersectionObserver(() => {
    setPage(page + 1);   // ❌ `page` is frozen at whatever it was on mount
  });
  observer.observe(sentinelRef.current!);
}, []);                  // ❌ so this callback is never rebuilt
```

Two independent fixes, and you want to understand why you need **both**:

- `setPage((p) => p + 1)` — the functional updater reads the *current* value
  instead of the captured one, so the frozen closure stops mattering.
- Re-create the observer when the things it depends on change, and disconnect
  the old one on cleanup:

```ts
useEffect(() => {
  const sentinel = sentinelRef.current;
  if (!sentinel || isLoading || !hasMore) return;   // no null observe, no double-fire

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) setPage((p) => p + 1);
  });
  observer.observe(sentinel);
  return () => observer.disconnect();               // no leaked observers
}, [isLoading, hasMore]);
```

Note what the guard buys you: while a request is in flight there is no
observer at all, so it is *structurally impossible* to double-fire. That's
better than a boolean check inside the callback, which races against itself.

Also note that `isLoading` here is **derived** (`loadedPage < page`), not a
`useState` flag flipped at the top of the effect. That's deliberate — this
repo runs `eslint-plugin-react-hooks` v7, whose `set-state-in-effect` rule
flags a synchronous `setIsLoading(true)` in an effect body as a cascading
render. Deriving it also means the flag can never drift out of sync with the
request it's describing.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173/infinite-scroll
npm run lint       # eslint-plugin-react-hooks will point at some of this
npm run build      # tsc -b
```

Watch the Network tab while you scroll. Before the fix you'll see page 2
requested repeatedly and nothing past it; after the fix, one request per page,
in order, stopping cleanly at post 40.

---

When you want to check your solution against a reference, ask and I'll drop a
completed version next to the stub.
