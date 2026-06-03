const { Post, User, Follower, Like } = require("../Models");
const { sequelize } = require("../config/db");
const { Op } = require("sequelize");
const cloudinary = require("../config/cloudinary");

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    let mediaUrl = null;
    let mediaType = "text";

    if (req.file) {
      const isVideo = req.file.mimetype.startsWith("video");

      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: isVideo ? "video" : "image",
        folder: "social_media_posts", // क्लाउड पर फोल्डर का नाम
      });

      mediaUrl = uploadResult.secure_url; // क्लाउड से मिला हुआ लिंक
      mediaType = isVideo ? "video" : "image";
    }

    // डेटाबेस में सेव करें
    const post = await Post.create({
      content,
      mediaUrl,
      mediaType,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const myId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const followingUsers = await Follower.findAll({
      where: { followerId: myId },
      attributes: ["followingId"],
    });

    const followingIds = followingUsers.map((f) => f.followingId);
    followingIds.push(myId);

    const { count, rows: posts } = await Post.findAndCountAll({
      where: {
        userId: {
          [Op.in]: followingIds,
        },
      },
      include: [
        {
          model: User,
          attributes: ["id", "username", "profilePic"],
        },
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(
          SELECT COUNT(*)
          FROM Likes AS l
          WHERE l.postId = Post.id
        )`),
            "likesCount",
          ],
          [
            sequelize.literal(`(
          SELECT COUNT(*)
          FROM Comments AS c
          WHERE c.postId = Post.id
        )`),
            "commentsCount",
          ],
          [
            sequelize.literal(`(
          SELECT COUNT(*)
          FROM Likes AS l
          WHERE l.postId = Post.id AND l.userId = '${myId}'
        )`),
            "isLikedRaw",
          ],
        ],
      },
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    const formattedPosts = posts.map((post) => {
      const postJson = post.toJSON();
      postJson.isLiked = postJson.isLikedRaw > 0;
      delete postJson.isLikedRaw;
      return postJson;
    });

    res.status(200).json({
      success: true,
      totalPosts: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      hasMore: page < Math.ceil(count / limit),
      count: formattedPosts.length,
      data: formattedPosts, // 👈 4. posts की जगह formattedPosts भेजा
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the post belongs to the logged-in user
    if (post.userId !== req.user.id) {
      return res
        .status(401)
        .json({ message: "User not authorized to delete this post" });
    }

    await post.destroy();

    res
      .status(200)
      .json({ success: true, message: "Post removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
