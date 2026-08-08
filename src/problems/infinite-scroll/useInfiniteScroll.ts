import { useEffect, useRef, useState } from "react";
import { fetchPage, type Post } from "./mockFeed";

/**
 * ---------------------------------------------------------------------------
 * TASK: Fix `useInfiniteScroll`.
 *
 * The hook loads a paginated feed and appends the next page whenever a
 * sentinel element at the bottom of the list scrolls into view. The wiring is
 * all here — and all three pieces below are subtly wrong.
 *
 * Requirements:
 *   - Load page 1 on mount, then load page N+1 when the sentinel becomes
 *     visible.
 *   - Never request the same page twice, and never skip a page.
 *   - Never fire a new request while one is already in flight, and stop
 *     entirely once the API reports `hasMore: false`.
 *   - Clean up after yourself: no leaked IntersectionObservers, no state
 *     updates from a request whose page is no longer current.
 *
 * Open the Network tab (or watch the console) while you scroll. If you see the
 * same page requested over and over, or a jump from page 2 to page 5, that's
 * the bug you're looking for.
 * ---------------------------------------------------------------------------
 */

export interface UseInfiniteScrollReturn {
  items: Post[];
  isLoading: boolean;
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

export function useInfiniteScroll(): UseInfiniteScrollReturn {
  const [items, setItems] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loadedPage, setLoadedPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // `isLoading` is derived, not stored: we're loading whenever the page we've
  // asked for is ahead of the page we've received. Leave this as is — it's the
  // one part that's already correct.
  const isLoading = loadedPage < page;

  // --- Effect A: fetch whenever `page` changes. ---------------------------
  useEffect(() => {
    const controller = new AbortController();

    fetchPage(page, controller.signal)
      .then((result) => {
        setItems((prev) => [...prev, ...result.items]);
        setHasMore(result.hasMore);
        setLoadedPage(page);
      })
      .catch((err) => {
        if (err.name !== "AbortError") throw err;
      });

    return () => {
      controller.abort();
    };
  }, [page]);

  // --- Effect B: advance the page when the sentinel scrolls into view. ----
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || isLoading || !hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((p) => p + 1);
      }
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [isLoading, hasMore]);

  return { items, isLoading, hasMore, sentinelRef };
}
