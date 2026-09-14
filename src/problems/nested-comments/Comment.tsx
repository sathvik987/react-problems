import type { CommentNode } from "./comments";
import { useState } from "react";

interface CommentProps {
  comment: CommentNode;
  replyingTo: string | null;
  onStartReply: (id: string) => void;
  onSubmitReply: (parentId: string, replyText: string) => void;
  onCancelReply: () => void;
}

/**
 * A single comment, which renders its own replies by rendering ITSELF.
 * The reply draft is local state — only the form that owns it needs it.
 */
export function Comment({
  comment,
  replyingTo,
  onStartReply,
  onSubmitReply,
  onCancelReply,
}: CommentProps) {
  const isReplying = replyingTo === comment.id;
  const [replyText, setReplyText] = useState("");

  return (
    <li className="comment">
      <div className="comment-head">
        <span className="comment-author">{comment.author}</span>
        <button onClick={() => onStartReply(comment.id)}>Reply</button>
      </div>

      <p className="comment-text">{comment.text}</p>

      {isReplying && (
        <form
          className="comment-reply-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitReply(comment.id, replyText);
            setReplyText("");
          }}
        >
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to ${comment.author}…`}
            aria-label={`Reply to ${comment.author}`}
          />
          <button type="submit">Post</button>
          <button
            type="button"
            onClick={() => {
              setReplyText("");
              onCancelReply();
            }}
          >
            Cancel
          </button>
        </form>
      )}

      {comment.replies.length > 0 && (
        <ul className="comment-replies">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              replyingTo={replyingTo}
              onStartReply={onStartReply}
              onSubmitReply={onSubmitReply}
              onCancelReply={onCancelReply}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
