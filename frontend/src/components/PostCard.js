import React, { useState } from "react";
import { format } from "timeago.js";
import { toast } from "react-toastify";
import { toggleLike, addComment, deleteComment, deletePost } from "../api";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

const API_BASE = process.env.REACT_APP_API_URL?.replace("/api", "") || "";

/**
 * PostCard — displays a single post with like/comment functionality.
 */
const PostCard = ({ post: initialPost, onDelete }) => {
  const { user, isLoggedIn } = useAuth();
  const [post, setPost] = useState(initialPost);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const isLiked = user && post.likes?.includes(user._id);
  const isOwner = user && post.user === user._id;

  // ─── Like Toggle ─────────────────────────────────────────
  const handleLike = async () => {
    if (!isLoggedIn) {
      toast.info("Login to like posts");
      return;
    }
    if (likeLoading) return;

    // Optimistic update
    const wasLiked = post.likes?.includes(user._id);
    setPost((prev) => ({
      ...prev,
      likes: wasLiked
        ? prev.likes.filter((id) => id !== user._id)
        : [...(prev.likes || []), user._id],
      likedBy: wasLiked
        ? prev.likedBy?.filter((u) => u !== user.username)
        : [...(prev.likedBy || []), user.username],
    }));

    setLikeLoading(true);
    try {
      const { data } = await toggleLike(post._id);
      setPost((prev) => ({ ...prev, likes: data.liked
        ? [...(prev.likes || []).filter(id => id !== user._id), user._id]
        : (prev.likes || []).filter(id => id !== user._id)
      }));
    } catch {
      // Revert on error
      setPost((prev) => ({
        ...prev,
        likes: wasLiked
          ? [...(prev.likes || []), user._id]
          : (prev.likes || []).filter((id) => id !== user._id),
      }));
      toast.error("Failed to update like");
    } finally {
      setLikeLoading(false);
    }
  };

  // ─── Add Comment ──────────────────────────────────────────
  const handleComment = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.info("Login to comment");
      return;
    }
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const { data } = await addComment(post._id, commentText);
      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), data.comment],
      }));
      setCommentText("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  // ─── Delete Comment ───────────────────────────────────────
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(post._id, commentId);
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  // ─── Delete Post ──────────────────────────────────────────
  const handleDeletePost = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(post._id);
      onDelete(post._id);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const imageUrl = post.image
    ? post.image.startsWith("http")
      ? post.image
      : `${API_BASE}${post.image}`
    : null;

  return (
    <div className="post-card">
      {/* ─── Header ─────────────────────────────── */}
      <div className="post-card-header">
        <div className="post-author">
          <Avatar username={post.username} size={44} />
          <div className="post-meta">
            <span className="post-username">@{post.username}</span>
            <span className="post-time">{format(post.createdAt)}</span>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleDeletePost}
            title="Delete post"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-muted)",
              fontSize: "1.1rem",
              padding: "4px 8px",
              borderRadius: "var(--radius-sm)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#ef4444")}
            onMouseLeave={(e) => (e.target.style.color = "var(--color-text-muted)")}
          >
            🗑
          </button>
        )}
      </div>

      {/* ─── Content ────────────────────────────── */}
      {post.content && (
        <div className="post-content">{post.content}</div>
      )}

      {/* ─── Image ──────────────────────────────── */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Post"
          className="post-image"
          loading="lazy"
        />
      )}

      {/* ─── Actions ────────────────────────────── */}
      <div className="post-actions">
        <button
          className={`action-btn ${isLiked ? "liked" : ""}`}
          onClick={handleLike}
          disabled={likeLoading}
        >
          {isLiked ? "❤️" : "🤍"}{" "}
          <span>{post.likes?.length || 0}</span>
          <span style={{ display: post.likes?.length > 0 ? "inline" : "none", marginLeft: 2 }}>
            {post.likes?.length === 1 ? "Like" : "Likes"}
          </span>
          {post.likes?.length === 0 && <span>Like</span>}
        </button>

        <button
          className={`action-btn ${showComments ? "comment-active" : ""}`}
          onClick={() => setShowComments((v) => !v)}
        >
          💬 {post.comments?.length || 0}{" "}
          {post.comments?.length === 1 ? "Comment" : "Comments"}
        </button>

        {/* Liked by preview */}
        {post.likedBy?.length > 0 && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.75rem",
              color: "var(--color-text-muted)",
            }}
          >
            {post.likedBy.slice(0, 2).join(", ")}
            {post.likedBy.length > 2 && ` +${post.likedBy.length - 2}`} liked
          </span>
        )}
      </div>

      {/* ─── Comments Section ────────────────────── */}
      {showComments && (
        <div className="comments-section">
          {/* Comments list */}
          {post.comments?.length > 0 ? (
            <div className="comments-list">
              {post.comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <Avatar username={comment.username} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="comment-bubble">
                      <div className="comment-user">@{comment.username}</div>
                      <div className="comment-text">{comment.text}</div>
                      <div className="comment-time">{format(comment.createdAt)}</div>
                    </div>
                  </div>
                  {/* Delete comment if owner */}
                  {user && (comment.user === user._id || post.user === user._id) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      title="Delete comment"
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-text-muted)",
                        fontSize: "0.75rem",
                        alignSelf: "flex-start",
                        marginTop: 6,
                        padding: "0 4px",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p
              style={{
                textAlign: "center",
                padding: "16px 0 8px",
                fontSize: "0.85rem",
                color: "var(--color-text-muted)",
              }}
            >
              No comments yet — be the first!
            </p>
          )}

          {/* Add comment input */}
          {isLoggedIn ? (
            <form className="comment-input-row" onSubmit={handleComment}>
              <Avatar username={user?.username} size={32} />
              <input
                className="comment-input"
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                maxLength={500}
              />
              <button
                type="submit"
                className="comment-submit"
                disabled={commentLoading || !commentText.trim()}
                title="Send"
              >
                {commentLoading ? "..." : "➤"}
              </button>
            </form>
          ) : (
            <p
              style={{
                textAlign: "center",
                padding: "12px 0 4px",
                fontSize: "0.85rem",
                color: "var(--color-text-muted)",
              }}
            >
              <a href="/login" style={{ color: "var(--color-primary)" }}>
                Log in
              </a>{" "}
              to comment
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
