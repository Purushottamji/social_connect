const express = require("express");
const {
  updateProfile,
  getMe,
  searchUsers,
  getUserProfile,
} = require("../Controllers/userController");
const { protect } = require("../Moddlewares/authMiddleware");
const upload = require("../Moddlewares/uploadMiddleware");

const router = express.Router();

router.put("/profile", protect, upload.single("profilePic"), updateProfile);
router.get("/me", protect, getMe);
router.get("/search", protect, searchUsers);
router.get("/:userId/profile", protect, getUserProfile);

module.exports = router;
