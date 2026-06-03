const express = require("express");
const {
  createPost,
  getAllPosts,
  deletePost,
} = require("../Controllers/postControllers");
const { protect } = require("../Middlewares/authMiddleware");
const upload = require("../Middlewares/uploadMiddleware");

const router = express.Router();

// Routes
router
  .route("/")
  .post(protect, upload.single("media"), createPost)
  .get(protect, getAllPosts);

router.route("/:id").delete(protect, deletePost);

module.exports = router;
