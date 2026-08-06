const ITEMS = [
  "Alpaca", "Antelope", "Badger", "Bison", "Camel", "Cheetah", "Dingo",
  "Elephant", "Falcon", "Gazelle", "Hedgehog", "Ibex", "Jackal", "Koala",
  "Lemur", "Meerkat", "Narwhal", "Ocelot", "Panda", "Quokka", "Raccoon",
  "Seal", "Tapir", "Urial", "Vulture", "Walrus", "Yak", "Zebra",
];

/**
 * Fake network search: filters `ITEMS` by `query` (case-insensitive substring
 * match) after a random 200ms-1200ms delay, simulating a real API with
 * variable latency. That variability is what makes out-of-order responses
 * possible: a fast response to a later keystroke can arrive before a slow
 * response to an earlier one.
 */
export async function searchItems(
  query: string,
  signal?: AbortSignal,
): Promise<string[]> {
  const delay = 200 + Math.random() * 1000;

  await new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(resolve, delay);
    signal?.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return ITEMS.filter((item) => item.toLowerCase().includes(q));
}
