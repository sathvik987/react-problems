export interface Post {
  id: number;
  title: string;
  body: string;
}

export interface PageResult {
  items: Post[];
  hasMore: boolean;
}

const PAGE_SIZE = 8;
const TOTAL_POSTS = 40;

const TOPICS = [
  "Reconciliation", "Suspense", "Hydration", "Memoization", "Portals",
  "Concurrent rendering", "Error boundaries", "Refs", "Context", "Transitions",
];

/**
 * Fake paginated feed: returns `PAGE_SIZE` posts for the requested 1-indexed
 * page after a random 400ms-1000ms delay, and reports whether more pages exist.
 * Pages past the end come back empty with `hasMore: false`.
 */
export async function fetchPage(
  page: number,
  signal?: AbortSignal,
): Promise<PageResult> {
  const delay = 400 + Math.random() * 600;

  await new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(resolve, delay);
    signal?.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

  const start = (page - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, TOTAL_POSTS);

  const items: Post[] = [];
  for (let i = start; i < end; i++) {
    items.push({
      id: i + 1,
      title: `#${i + 1} — ${TOPICS[i % TOPICS.length]}`,
      body: `Post ${i + 1} of ${TOTAL_POSTS}, served from page ${page}.`,
    });
  }

  return { items, hasMore: end < TOTAL_POSTS };
}
