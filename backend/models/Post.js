const mongoose = require("mongoose");

/**
 * Post Schema
 * Stores posts, likes, and comments — all in one collection.
 * Users who liked/commented are tracked by username + userId.
 */
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    // Either text or image (or both) must be present — validated at route level
    content: {
      type: String,
      maxlength: [1000, "Post content cannot exceed 1000 characters"],
      default: "",
    },
    image: {
      type: String, // URL from Cloudinary or local path
      default: "",
    },
    // Array of user IDs who liked the post
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Array of usernames who liked (for quick display without populating)
    likedBy: [{ type: String }],
    // Embedded comments for fast retrieval
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Virtual for like count
postSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Post", postSchema);
