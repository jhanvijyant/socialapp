import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { createPost } from "../api";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

/**
 * CreatePost — lets authenticated users post text, image, or both.
 */
const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !imageFile) {
      toast.error("Add some text or an image to post!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (content.trim()) formData.append("content", content.trim());
      if (imageFile) formData.append("image", imageFile);

      const { data } = await createPost(formData);
      onPostCreated(data.post);
      setContent("");
      removeImage();
      toast.success("Post shared! 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-card">
      <div className="create-post-top">
        <Avatar username={user?.username} size={44} />
        <textarea
          className="create-post-input"
          placeholder={`What's on your mind, ${user?.username}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          rows={3}
        />
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="image-preview-container">
          <img src={imagePreview} alt="Preview" className="image-preview" />
          <button
            className="remove-image-btn"
            onClick={removeImage}
            title="Remove image"
            type="button"
          >
            ✕
          </button>
        </div>
      )}

      {/* Footer: image upload + char count + post button */}
      <div className="create-post-footer">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Hidden file input */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            title="Add image"
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: "var(--radius-full)",
              border: "1.5px solid var(--color-border)",
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "var(--color-text-secondary)",
              transition: "all 0.2s",
              background: imageFile ? "var(--color-primary-light)" : "transparent",
              borderColor: imageFile ? "var(--color-primary)" : "var(--color-border)",
              color: imageFile ? "var(--color-primary)" : "var(--color-text-secondary)",
            }}
          >
            📷 Photo
          </label>

          {content.length > 0 && (
            <span
              style={{
                fontSize: "0.775rem",
                color: content.length > 900 ? "#ef4444" : "var(--color-text-muted)",
              }}
            >
              {content.length}/1000
            </span>
          )}
        </div>

        <button
          className="post-submit-btn"
          onClick={handleSubmit}
          disabled={loading || (!content.trim() && !imageFile)}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
