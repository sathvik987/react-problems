import type { ReactNode } from "react";
import { Stopwatch } from "./stopwatch/Stopwatch";

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
];
