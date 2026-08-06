import type { ReactNode } from "react";
import { Stopwatch } from "./stopwatch/Stopwatch";
import { SearchBox } from "./debounced-search/SearchBox";

export interface Problem {
  slug: string;
  title: string;
  description: string;
  element: ReactNode;
}

// Add new problems here — one entry per problem, each living in its own
// folder under src/problems/<slug>/.
export const problems: Problem[] = [
  {
    slug: "stopwatch",
    title: "Stopwatch",
    description:
      "Start / Pause / Reset with a custom hook. Gotcha: typing the setInterval ref correctly.",
    element: <Stopwatch />,
  },
  {
    slug: "debounced-search",
    title: "Debounced Search",
    description:
      "Debounce a search input against a slow, variable-latency API. Gotcha: out-of-order responses race and clobber newer results.",
    element: <SearchBox />,
  },
];
