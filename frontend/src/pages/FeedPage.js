import React, { useState, useEffect, useCallback } from "react";
import { fetchPosts } from "../api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import { toast } from "react-toastify";

/**
 * FeedPage — public feed showing all posts, with pagination.
 * Authenticated users can create posts.
 */
const FeedPage = () => {
  const { isLoggedIn } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, hasMore: false, pages: 1 });

  // Initial load
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchPosts(1, 10);
      setPosts(data.posts);
      setPagination({ page: 1, ...data.pagination });
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Load more (pagination)
  const handleLoadMore = async () => {
    if (loadingMore || !pagination.hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = pagination.page + 1;
      const { data } = await fetchPosts(nextPage, 10);
      setPosts((prev) => [...prev, ...data.posts]);
      setPagination({ page: nextPage, ...data.pagination });
    } catch {
      toast.error("Failed to load more posts");
    } finally {
      setLoadingMore(false);
    }
  };

  // Prepend new post to feed
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Remove deleted post from feed
  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  return (
    <div className="main-content">
      <div className="feed-container">
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 28,
            paddingTop: 8,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              color: "var(--color-text-primary)",
              letterSpacing: "-0.5px",
              marginBottom: 4,
            }}
          >
            What's happening
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            Share moments with the world ✦
          </p>
        </div>

        {/* Create post box (only logged in) */}
        {isLoggedIn && (
          <CreatePost onPostCreated={handlePostCreated} />
        )}

        {/* Feed */}
        {loading ? (
          <div className="spinner" />
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✦</div>
            <h3>No posts yet</h3>
            <p>Be the first to share something!</p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handlePostDeleted}
              />
            ))}

            {/* Load more */}
            {pagination.hasMore && (
              <button
                className="load-more-btn"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading..." : `Load more posts`}
              </button>
            )}

            <p
              style={{
                textAlign: "center",
                padding: "20px 0 8px",
                fontSize: "0.8rem",
                color: "var(--color-text-muted)",
              }}
            >
              {posts.length} post{posts.length !== 1 ? "s" : ""} shown
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
