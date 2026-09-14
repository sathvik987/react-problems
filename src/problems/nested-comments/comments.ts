export interface CommentNode {
  id: string;
  author: string;
  text: string;
  replies: CommentNode[];
}

/**
 * The seed thread. A module-level constant — it is created once when this
 * file is first imported and is never meant to change. Worth remembering
 * when something starts writing into it.
 */
export const INITIAL_COMMENTS: CommentNode[] = [
  {
    id: "c1",
    author: "Ada",
    text: "Does anyone actually use useImperativeHandle in production?",
    replies: [
      {
        id: "c1-r1",
        author: "Luis",
        text: "Rarely. Mostly for focus() on a wrapped input.",
        replies: [
          {
            id: "c1-r1-r1",
            author: "Mei",
            text: "Same — that and scrollIntoView on a list wrapper.",
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: "c2",
    author: "Priya",
    text: "Hot take: most useEffects in a codebase shouldn't exist.",
    replies: [
      {
        id: "c2-r1",
        author: "Tomas",
        text: "Not a hot take, that's just the docs at this point.",
        replies: [],
      },
    ],
  },
];
