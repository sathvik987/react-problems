# 🧩 Interview Problem: Infinite Scroll

Load the next page of a feed when the bottom of the list scrolls into view.

## What's given

- `mockFeed.ts` — fake paginated API (8 posts/page, 40 total, 400–1000ms
  random latency). Accepts an `AbortSignal`. Don't touch it.
- `useInfiniteScroll.ts` — the hook. Runs, but has three bugs.
- `Feed.tsx` — the UI. Complete.

## Expected behaviour

- Page 1 loads on mount, then page N+1 loads when the sentinel becomes visible.
- Exactly one request per page, in order. No page requested twice, none skipped.
- No new request fires while one is already in flight.
- Loading stops for good once the API returns `hasMore: false`.
- No leaked IntersectionObservers, no duplicate posts, no crash at the end of
  the feed.

## The three bugs

1. **Stale closure.** The observer callback captures `page` from the render
   that created it, and `[]` deps mean it's never rebuilt.
2. **No cleanup.** Nothing disconnects the observer, so every effect re-run
   leaks another one — and StrictMode starts you with two.
3. **Unguarded fetch.** No `AbortSignal`, so a response for an abandoned page
   still resolves and appends. You'll see duplicate `key` warnings immediately.

Once those are fixed, watch for a fourth: the sentinel can still be on screen
after a page lands, and `observer.observe(sentinelRef.current!)` will throw
once the sentinel stops rendering.

## Run it

```bash
npm run dev        # http://localhost:5173/problems/infinite-scroll
npm run lint
npm run build
```

Watch the Network tab while scrolling.

---

Want the solution? Ask and I'll drop a completed version next to the stub.
