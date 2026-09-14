import type { ReactNode } from "react";
import { Stopwatch } from "./stopwatch/Stopwatch";
import { SearchBox } from "./debounced-search/SearchBox";
import { Feed } from "./infinite-scroll/Feed";
import { TodoEditor } from "./undo-redo/TodoEditor";
import { EmployeeDirectory } from "./employee-directory/EmployeeDirectory";
import { ModalDemo } from "./modal-dialog/ModalDemo";
import { CommentSection } from "./nested-comments/CommentSection";

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
  {
    slug: "infinite-scroll",
    title: "Infinite Scroll",
    description:
      "Load the next page when a sentinel scrolls into view. Gotcha: the IntersectionObserver callback closes over a stale page, and nothing disconnects it.",
    element: <Feed />,
  },
  {
    slug: "undo-redo",
    title: "Undo / Redo",
    description:
      "A generic past/present/future history hook on useReducer. Gotcha: an impure reducer that mutates, and a redo branch that survives an edit it should have killed.",
    element: <TodoEditor />,
  },
  {
    slug: "employee-directory",
    title: "Searchable Directory",
    description:
      "Filter and sort a list. Gotcha: derived state kept in useState and synced by an effect, an in-place .sort() on shared data, and index keys that break on reorder.",
    element: <EmployeeDirectory />,
  },
  {
    slug: "modal-dialog",
    title: "Modal Dialog",
    description:
      "Build an accessible dialog. Gotcha: rendered inline so it gets clipped, backdrop clicks that fire from inside, and a keydown listener that never gets removed.",
    element: <ModalDemo />,
  },
  {
    slug: "nested-comments",
    title: "Nested Comments",
    description:
      "A recursive reply thread. Gotcha: an update that never recurses, a push that mutates the seed data, and one draft string shared by every reply box.",
    element: <CommentSection />,
  },
];
