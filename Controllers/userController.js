const { User, Post, Follower } = require("../Models");
const cloudinary = require("../config/cloudinary");
const { Op } = require("sequelize");

exports.updateProfile = async (req, res) => {
  try {
    // 1. पक्का करें कि ID हमेशा Integer (नंबर) फॉर्म में हो
    const userId = parseInt(req.user.id, 10);

    const { username, bio } = req.body;

    // 2. यूजर को डेटाबेस में ढूंढें
    let user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let profilePicUrl = user.profilePic;

    // 3. क्लाउडिनरी अपलोड ब्लॉक
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "social_media_profiles",
        transformation: [{ width: 400, height: 400, crop: "limit" }],
      });
      profilePicUrl = uploadResult.secure_url;
    }

    // 4. डेटा अपडेट (खाली स्ट्रिंग को भी हैंडल करने के लिए सुरक्षित तरीका)
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    user.profilePic = profilePicUrl;

    await user.save(); // डेटाबेस में सेव करें

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    // 🌟 यह लाइन सबसे जरूरी है! इससे टर्मिनल में असली एरर दिखेगा
    console.error("🔴 Backend Update Profile Error:", error);

    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 🌟 अब जब ऊपर Post इम्पोर्ट हो गया है, तो यह लाइन परफेक्ट काम करेगी
    const postCount = await Post.count({ where: { userId: userId } });

    // अगर अभी फॉलोअर का मॉडल या टेबल नहीं बनाया है, तो इसे अस्थाई रूप से 0 रख सकते हैं
    let followerCount = 0;
    let followingCount = 0;

    if (typeof Follower !== "undefined") {
      followerCount = await Follower.count({ where: { followingId: userId } });
      followingCount = await Follower.count({ where: { followerId: userId } });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
        postCount: postCount,
        followerCount: followerCount,
        followingCount: followingCount,
      },
    });
  } catch (error) {
    console.error("Error in /me route:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query; // फ्रंटएंड से ?query=username भेजा जाएगा
    const currentUserId = req.user.id; // खुद को सर्च रिजल्ट में न दिखाने के लिए

    if (!query) {
      return res.status(200).json({ success: true, users: [] });
    }

    const users = await User.findAll({
      where: {
        username: {
          [Op.like]: `%${query}%`, // SQL: WHERE username LIKE '%query%'
        },
        id: {
          [Op.ne]: currentUserId, // खुद की आईडी को सर्च से बाहर रखें
        },
      },
      attributes: ["id", "username", "profilePic", "bio"], // सिर्फ जरूरी चीजें भेजें
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // 1. यूजर का डेटा निकालें
    const user = await User.findByPk(userId, {
      attributes: ["id", "username", "email", "bio", "profilePic"],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 2. 🌟 इस यूजर की सारी पोस्ट्स निकालें (ताकि ग्रिड में दिख सकें)
    const posts = await Post.findAll({
      where: { userId },
      attributes: ["id", "mediaUrl", "content", "mediaType", "createdAt"], // जो फील्ड्स आपको चाहिए
      order: [["createdAt", "DESC"]], // नई पोस्ट सबसे पहले
    });

    // 3. काउंट्स निकालें
    const postCount = posts.length; // findAll की मदद से काउंट अपने आप मिल गया
    const followerCount = await Follower.count({
      where: { followingId: userId },
    });
    const followingCount = await Follower.count({
      where: { followerId: userId },
    });

    // 4. क्या करंट यूजर ने इसे फॉलो किया हुआ है?
    const isFollowing = await Follower.findOne({
      where: { followerId: currentUserId, followingId: userId },
    });

    // 5. 🌟 रिस्पॉन्स में 'posts' की एरे भी भेजें
    res.status(200).json({
      success: true,
      user: {
        ...user.toJSON(),
        postCount,
        followerCount,
        followingCount,
        isFollowing: !!isFollowing,
        posts: posts, // 👈 यह रही आपकी पोस्ट्स की लिस्ट!
      },
    });
  } catch (error) {
    console.error("🔴 Error in getUserProfile:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
