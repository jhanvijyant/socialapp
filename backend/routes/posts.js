const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Post = require("../models/Post");
const { protect } = require("../middleware/auth");

// ─── Multer Setup (local storage, swap for Cloudinary in prod) ────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `post-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ─── GET /api/posts — Public Feed with Pagination ─────────────────
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit)
        .lean(), // Use lean for performance
      Post.countDocuments(),
    ]);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Feed error:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// ─── POST /api/posts — Create Post ───────────────────────────────
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { content } = req.body;
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    // Validate: at least content or image required
    if (!content?.trim() && !imageUrl) {
      return res
        .status(400)
        .json({ message: "Post must have text content or an image" });
    }

    const post = await Post.create({
      user: req.user._id,
      username: req.user.username,
      content: content?.trim() || "",
      image: imageUrl,
    });

    res.status(201).json({ message: "Post created", post });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// ─── DELETE /api/posts/:id — Delete Own Post ─────────────────────
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    // Remove local image file if it exists
    if (post.image && post.image.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "..", post.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

// ─── PUT /api/posts/:id/like — Toggle Like ────────────────────────
router.put("/:id/like", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    const username = req.user.username;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
      post.likedBy = post.likedBy.filter((u) => u !== username);
    } else {
      // Like
      post.likes.push(userId);
      if (!post.likedBy.includes(username)) post.likedBy.push(username);
    }

    await post.save();

    res.json({
      liked: !alreadyLiked,
      likeCount: post.likes.length,
      likedBy: post.likedBy,
    });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Failed to toggle like" });
  }
});

// ─── POST /api/posts/:id/comment — Add Comment ───────────────────
router.post("/:id/comment", protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    if (text.trim().length > 500) {
      return res.status(400).json({ message: "Comment cannot exceed 500 characters" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      user: req.user._id,
      username: req.user.username,
      text: text.trim(),
    };

    post.comments.push(comment);
    await post.save();

    // Return the newly added comment
    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      message: "Comment added",
      comment: newComment,
      commentCount: post.comments.length,
    });
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
});

// ─── DELETE /api/posts/:postId/comment/:commentId ─────────────────
router.delete("/:postId/comment/:commentId", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only comment author or post author can delete
    if (
      comment.user.toString() !== req.user._id.toString() &&
      post.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.deleteOne();
    await post.save();

    res.json({ message: "Comment deleted", commentCount: post.comments.length });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

module.exports = router;
