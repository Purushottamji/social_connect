const { Post, User, Follower } = require("../Models");
const { Op } = require("sequelize"); // Sequelize operators (queries के लिए)
const cloudinary = require("../config/cloudinary"); // Cloudinary config for media uploads

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    let mediaUrl = null;
    let mediaType = "text";

    // चेक करें कि क्या यूजर ने कोई फाइल भेजी है?
    if (req.file) {
      const isVideo = req.file.mimetype.startsWith("video");

      // Cloudinary पर अपलोड करें (अगर वीडियो है तो resource_type: 'video' देना ज़रूरी है)
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

// @desc    Get Personalized Timeline Feed with Pagination
// @route   GET /api/posts
// @access  Private (लॉगिन होना ज़रूरी है ताकि हम सही फीड दिखा सकें)
// exports.getAllPosts = async (req, res) => {
//   try {
//     // Fetch all posts and automatically include User info (JOIN query)
//     const posts = await Post.findAll({
//       include: [
//         {
//           model: User,
//           attributes: ["id", "username", "profilePic"], // सिर्फ काम का डेटा लेंगे, पासवर्ड नहीं!
//         },
//       ],
//       order: [["createdAt", "DESC"]], // नई पोस्ट्स सबसे ऊपर दिखेंगी
//     });

//     res.status(200).json({ success: true, count: posts.length, data: posts });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

exports.getAllPosts = async (req, res) => {
  try {
    const myId = req.user.id;

    // 1. Pagination Parameters सेट करें (Query params से या default)
    const page = parseInt(req.query.page) || 1; // डिफ़ॉल्ट पहला पेज
    const limit = parseInt(req.query.limit) || 10; // डिफ़ॉल्ट एक बार में 10 पोस्ट्स
    const offset = (page - 1) * limit; // कितने पोस्ट्स छोड़कर आगे बढ़ना है

    // 2. उन सब यूजर्स की IDs निकालें जिन्हें मैं फॉलो करता हूँ
    const followingUsers = await Follower.findAll({
      where: { followerId: myId },
      attributes: ["followingId"],
    });

    // IDs को एक एरे (Array) में कंवर्ट करें: [id1, id2, id3...]
    const followingIds = followingUsers.map((f) => f.followingId);

    // अपने खुद के पोस्ट्स भी फीड में दिखाने के लिए अपनी ID जोड़ें
    followingIds.push(myId);

    // 3. सिर्फ़ इन IDs वाले पोस्ट्स डेटाबेस से निकालें (Pagination के साथ)
    // findAndCountAll हमें डेटा के साथ-साथ टोटल काउंट भी देता है
    const { count, rows: posts } = await Post.findAndCountAll({
      where: {
        userId: {
          [Op.in]: followingIds, // SQL: WHERE userId IN (id1, id2...)
        },
      },
      include: [
        {
          model: User,
          attributes: ["id", "username", "profilePic"],
        },
      ],
      order: [["createdAt", "DESC"]], // लेटेस्ट पोस्ट्स पहले
      limit: limit,
      offset: offset,
    });

    // 4. रिस्पॉन्स में Pagination की डिटेल्स भी भेजें ताकि फ्रंटएंड (Flutter/React) को पता रहे अगला पेज है या नहीं
    res.status(200).json({
      success: true,
      totalPosts: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      hasMore: page < Math.ceil(count / limit),
      count: posts.length,
      data: posts,
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
