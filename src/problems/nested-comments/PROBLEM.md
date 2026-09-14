# 🧩 Interview Problem: Nested Comments

A Reddit-style reply thread that nests arbitrarily deep. A machine-coding
staple — the recursion is the easy half, updating a tree immutably is the half
people fumble.

## What's given

- `comments.ts` — the seed thread and the `CommentNode` type. Don't touch it.
- `Comment.tsx` — renders one comment and recurses into its replies. Correct.
- `CommentSection.tsx` — holds the state. Three bugs.

## Expected behaviour

- Replying works at **any** depth, not just on top-level comments.
- A new reply appears nested under the comment it was a reply to, and the
  "N comments" count goes up by one.
- Only the box you clicked Reply on has your draft in it. Opening a second
  reply box does not show the same half-typed text.
- Leaving the page and coming back gives you the original seed thread again.

## The three bugs

1. **The update never recurses.** It only scans top-level comments for the
   parent id, so replying to anything nested is silently dropped.
2. **`.push()` mutates the seed.** The nodes being written into came from
   `INITIAL_COMMENTS`, so the module constant itself is edited. Post a reply,
   hit Back, re-open the page — your reply survives a state reset.
3. **One draft for the whole thread.** `replyText` lives in `CommentSection`,
   so every reply form reads and writes the same string.

## Run it

```bash
npm run dev        # http://localhost:5173/problems/nested-comments
npm run lint
npm run build
```

## Follow-ups an interviewer would ask

- Add delete. What should happen to a deleted comment's replies?
- The recursion is fine at depth 5. What breaks at depth 5,000, and what would
  you do about it?
- `Comment` takes seven props, most of them threaded straight through. What
  would you reach for to stop that?
- How would you render this from a flat `{ id, parentId }` list instead of a
  nested tree — and which shape would you rather receive from an API?

---

Want the solution? Ask and I'll drop a completed version next to the stub.
