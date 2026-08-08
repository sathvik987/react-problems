import { useInfiniteScroll } from "./useInfiniteScroll";

/**
 * The UI is complete — everything you need to change lives in
 * `useInfiniteScroll.ts`.
 *
 * Two details worth noticing, because the hook depends on both:
 *   - The sentinel is only rendered while `hasMore` is true. So `sentinelRef`
 *     goes back to null once the feed is exhausted, and the hook has to cope.
 *   - The scroll container is this element, not the window. An
 *     IntersectionObserver with no `root` option observes the viewport, which
 *     still works here — but ask yourself whether it should.
 */
export function Feed() {
  const { items, isLoading, hasMore, sentinelRef } = useInfiniteScroll();

  return (
    <div className="feed">
      <ul className="feed-list">
        {items.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>

      {isLoading && <p className="feed-status">Loading more…</p>}
      {!hasMore && <p className="feed-status">🎉 You've reached the end.</p>}

      {hasMore && <div ref={sentinelRef} className="feed-sentinel" />}
    </div>
  );
}
