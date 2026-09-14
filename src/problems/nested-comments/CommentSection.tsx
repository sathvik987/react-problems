import { useState } from "react";
import { Comment } from "./Comment";
import { INITIAL_COMMENTS, type CommentNode } from "./comments";

function countComments(nodes: CommentNode[]): number {
  return nodes.reduce((n, c) => n + 1 + countComments(c.replies), 0);
}

/**
 * Returns a NEW tree with `reply` appended under `parentId`. Rebuilds only the
 * nodes on the path from the root to the parent; every untouched subtree keeps
 * its original object reference.
 */
function addReply(
  nodes: CommentNode[],
  parentId: string,
  reply: CommentNode,
): CommentNode[] {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return { ...node, replies: [...node.replies, reply] };
    }
    if (node.replies.length === 0) return node;
    return { ...node, replies: addReply(node.replies, parentId, reply) };
  });
}

export function CommentSection() {
  // No clone needed: `addReply` never writes into the seed.
  const [comments, setComments] = useState<CommentNode[]>(INITIAL_COMMENTS);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmitReply = (parentId: string, replyText: string) => {
    const text = replyText.trim();
    if (!text) return;

    const reply: CommentNode = {
      id: crypto.randomUUID(),
      author: "You",
      text,
      replies: [],
    };

    setComments((prev) => addReply(prev, parentId, reply));
    setReplyingTo(null);
  };

  return (
    <div className="comment-section">
      <p className="comment-count">{countComments(comments)} comments</p>

      <ul className="comment-list">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            replyingTo={replyingTo}
            onStartReply={setReplyingTo}
            onSubmitReply={handleSubmitReply}
            onCancelReply={() => {
              setReplyingTo(null);
            }}
          />
        ))}
      </ul>
    </div>
  );
}
