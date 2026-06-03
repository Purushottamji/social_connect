const { Like, Post } = require("../models");

exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if already liked
    const existingLike = await Like.findOne({ where: { userId, postId } });

    if (existingLike) {
      // Already liked, so Unlike it
      await existingLike.destroy();
      return res
        .status(200)
        .json({ success: true, message: "Post unliked successfully" });
    } else {
      // Not liked, so Like it
      await Like.create({ userId, postId });
      return res
        .status(201)
        .json({ success: true, message: "Post liked successfully" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
