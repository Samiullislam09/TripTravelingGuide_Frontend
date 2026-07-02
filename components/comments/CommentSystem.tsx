"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Heart, MessageCircle, Loader2, Send } from "lucide-react";
import {
  fetchComments,
  postComment,
  likeComment,
  type Comment,
} from "@/lib/api";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const sec = Math.round(diff / 1000);
  if (sec < 45) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.round(day / 7);
  if (wk < 5) return `${wk}w ago`;
  const mo = Math.round(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  const yr = Math.round(day / 365);
  return `${yr}y ago`;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/* ------------------------------------------------------------------ */
/* avatar                                                             */
/* ------------------------------------------------------------------ */

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 select-none items-center justify-center rounded-full bg-brand-600/10 font-semibold text-brand-700",
        size === "md" ? "h-10 w-10 text-sm" : "h-9 w-9 text-xs",
      )}
    >
      {initialsOf(name)}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* reply / comment form                                               */
/* ------------------------------------------------------------------ */

interface CommentFormProps {
  postSlug: string;
  parentId?: string | null;
  onAdded: (comment: Comment) => void;
  compact?: boolean;
  autoFocus?: boolean;
  onCancel?: () => void;
}

function CommentForm({
  postSlug,
  parentId = null,
  onAdded,
  compact = false,
  autoFocus = false,
  onCancel,
}: CommentFormProps) {
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (autoFocus) bodyRef.current?.focus();
  }, [autoFocus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    const trimmedBody = body.trim();
    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (!trimmedBody) {
      setError("Please write a comment before posting.");
      return;
    }
    setPosting(true);
    try {
      const created = await postComment({
        postSlug,
        name: trimmedName,
        body: trimmedBody,
        parentId: parentId ?? undefined,
      });
      onAdded(created);
      setName("");
      setBody("");
      onCancel?.();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", compact && "space-y-2")}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        aria-label="Your name"
        disabled={posting}
        className={cn(
          "w-full rounded-2xl border border-line bg-surface px-4 text-sm text-ink-900 placeholder:text-ink-400",
          "outline-none transition focus-visible:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-600/30",
          "disabled:opacity-60",
          compact ? "py-2.5" : "py-3",
        )}
      />
      <textarea
        ref={bodyRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={parentId ? "Write a reply…" : "Share your thoughts…"}
        aria-label={parentId ? "Write a reply" : "Write a comment"}
        rows={compact ? 2 : 3}
        disabled={posting}
        className={cn(
          "w-full resize-y rounded-2xl border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-ink-900 placeholder:text-ink-400",
          "outline-none transition focus-visible:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-600/30",
          "disabled:opacity-60",
        )}
      />

      <div aria-live="polite" className="min-h-0">
        {error && (
          <p className="text-sm font-medium text-coral-600">{error}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={posting}
          className="btn btn-primary inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {posting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          {posting ? "Posting…" : parentId ? "Post reply" : "Post comment"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={posting}
            className="btn btn-ghost"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* single comment                                                     */
/* ------------------------------------------------------------------ */

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  postSlug: string;
  onReplyAdded: (comment: Comment) => void;
  onLiked: (id: string, likes: number) => void;
  isReply?: boolean;
}

function CommentItem({
  comment,
  replies,
  postSlug,
  onReplyAdded,
  onLiked,
  isReply = false,
}: CommentItemProps) {
  const [replying, setReplying] = useState(false);
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    // optimistic increment
    onLiked(comment.id, comment.likes + 1);
    try {
      const { likes } = await likeComment(comment.id);
      onLiked(comment.id, likes);
    } catch {
      // revert on failure
      onLiked(comment.id, comment.likes);
    } finally {
      setLiking(false);
    }
  };

  return (
    <article className="flex gap-3" data-reveal="up">
      <Avatar name={comment.name} size={isReply ? "sm" : "md"} />

      <div className="min-w-0 flex-1">
        <div className="rounded-3xl border border-line bg-surface px-4 py-3 shadow-card">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-semibold text-ink-900">{comment.name}</span>
            <time
              dateTime={comment.createdAt}
              className="text-xs text-ink-400"
              title={new Date(comment.createdAt).toLocaleString()}
            >
              {relativeTime(comment.createdAt)}
            </time>
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-ink-700">
            {comment.body}
          </p>
        </div>

        <div className="mt-1.5 flex items-center gap-1 pl-2">
          <button
            type="button"
            onClick={handleLike}
            disabled={liking}
            aria-label={`Like comment by ${comment.name}, ${comment.likes} likes`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-ink-500 transition",
              "hover:bg-coral-500/10 hover:text-coral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500/40",
              comment.likes > 0 && "text-coral-600",
            )}
          >
            <Heart
              className={cn("h-3.5 w-3.5", comment.likes > 0 && "fill-current")}
              aria-hidden="true"
            />
            {comment.likes > 0 ? comment.likes : "Like"}
          </button>

          {!isReply && (
            <button
              type="button"
              onClick={() => setReplying((v) => !v)}
              aria-expanded={replying}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-ink-500 transition hover:bg-brand-600/10 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/30"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Reply
            </button>
          )}
        </div>

        {replying && (
          <div className="mt-3">
            <CommentForm
              postSlug={postSlug}
              parentId={comment.id}
              onAdded={onReplyAdded}
              onCancel={() => setReplying(false)}
              compact
              autoFocus
            />
          </div>
        )}

        {replies.length > 0 && (
          <div className="mt-4 space-y-4 border-l-2 border-line pl-4">
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                replies={[]}
                postSlug={postSlug}
                onReplyAdded={onReplyAdded}
                onLiked={onLiked}
                isReply
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* skeleton                                                           */
/* ------------------------------------------------------------------ */

function CommentSkeleton() {
  return (
    <div className="flex animate-pulse gap-3">
      <div className="h-10 w-10 shrink-0 rounded-full bg-surface-2" />
      <div className="flex-1 space-y-2">
        <div className="rounded-3xl border border-line bg-surface px-4 py-3">
          <div className="h-3 w-28 rounded bg-surface-2" />
          <div className="mt-2 h-3 w-full rounded bg-surface-2" />
          <div className="mt-1.5 h-3 w-2/3 rounded bg-surface-2" />
        </div>
        <div className="h-3 w-20 rounded bg-surface-2" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* main                                                               */
/* ------------------------------------------------------------------ */

export default function CommentSystem({ postSlug }: { postSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(null);
    fetchComments(postSlug)
      .then((data) => {
        if (active) setComments(data);
      })
      .catch(() => {
        if (active) setLoadError("We couldn't load comments right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [postSlug]);

  const handleAdded = useCallback((comment: Comment) => {
    setComments((prev) => [...prev, comment]);
  }, []);

  const handleLiked = useCallback((id: string, likes: number) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes } : c)),
    );
  }, []);

  const { topLevel, repliesByParent, total } = useMemo(() => {
    const tops: Comment[] = [];
    const byParent = new Map<string, Comment[]>();
    for (const c of comments) {
      if (c.parentId) {
        const list = byParent.get(c.parentId) ?? [];
        list.push(c);
        byParent.set(c.parentId, list);
      } else {
        tops.push(c);
      }
    }
    const byTime = (a: Comment, b: Comment) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    tops.sort(byTime);
    for (const list of byParent.values()) list.sort(byTime);
    return { topLevel: tops, repliesByParent: byParent, total: comments.length };
  }, [comments]);

  return (
    <section aria-labelledby="comments-heading" className="space-y-8">
      <h2
        id="comments-heading"
        className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl"
      >
        {loading ? "Comments" : `${total} ${total === 1 ? "Comment" : "Comments"}`}
      </h2>

      {/* top-level form */}
      <div className="rounded-4xl border border-line bg-surface-2 p-5 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-500">
          Join the conversation
        </h3>
        <CommentForm postSlug={postSlug} onAdded={handleAdded} />
      </div>

      {/* list */}
      {loading ? (
        <div className="space-y-6" aria-busy="true" aria-live="polite">
          <CommentSkeleton />
          <CommentSkeleton />
          <CommentSkeleton />
        </div>
      ) : loadError ? (
        <p className="rounded-3xl border border-line bg-surface p-6 text-center text-sm text-ink-500" aria-live="polite">
          {loadError}
        </p>
      ) : topLevel.length === 0 ? (
        <div className="rounded-4xl border border-dashed border-line bg-surface px-6 py-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600/10 text-brand-700">
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="font-semibold text-ink-900">No comments yet</p>
          <p className="mt-1 text-sm text-ink-500">
            Be the first to share your thoughts on this story.
          </p>
        </div>
      ) : (
        <div className="space-y-6" data-reveal-stagger>
          {topLevel.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={repliesByParent.get(comment.id) ?? []}
              postSlug={postSlug}
              onReplyAdded={handleAdded}
              onLiked={handleLiked}
            />
          ))}
        </div>
      )}
    </section>
  );
}
