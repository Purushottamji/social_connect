const express = require("express");
const {
  createPost,
  getAllPosts,
  deletePost,
} = require("../Controllers/postControllers");
const { protect } = require("../Moddlewares/authMiddleware");
const upload = require("../Moddlewares/uploadMiddleware");

const router = express.Router();

// Routes
router
  .route("/")
  .post(protect, upload.single("media"), createPost) // सिर्फ लॉगिन यूजर्स पोस्ट कर सकते हैं
  .get(protect, getAllPosts); // पोस्ट्स कोई भी देख सकता है

router.route("/:id").delete(protect, deletePost); // सिर्फ वही यूजर डिलीट कर सकता है जिसने पोस्ट की है

module.exports = router;
