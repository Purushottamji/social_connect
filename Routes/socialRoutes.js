const express = require("express");
const { toggleLike } = require("../Controllers/likeController");
const { toggleFollow } = require("../Controllers/followController");
const {
  addComment,
  getPostComments,
} = require("../Controllers/commentController");
const { protect } = require("../Moddlewares/authMiddleware");

const router = express.Router();

// Like Route
router.post("/posts/:postId/like", protect, toggleLike);

// Comment Routes
router.post("/posts/:postId/comment", protect, addComment);
router.get("/posts/:postId/comments", getPostComments);
router.post("/users/:targetUserId/follow", protect, toggleFollow);

module.exports = router;
