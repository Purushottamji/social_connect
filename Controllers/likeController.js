const { Like, Post } = require("../Models");

exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const existingLike = await Like.findOne({ where: { userId, postId } });

    if (existingLike) {
      await existingLike.destroy();
      const likesCount = await Like.count({ where: { postId } });
      return res
        .status(200)
        .json({
          success: true,
          message: "Post unliked successfully",
          isLiked: false,
          likesCount: likesCount,
        });
    } else {
      await Like.create({ userId, postId });
      const likesCount = await Like.count({ where: { postId } });
      return res
        .status(201)
        .json({
          success: true,
          message: "Post liked successfully",
          isLiked: true,
          likesCount: likesCount,
        });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
