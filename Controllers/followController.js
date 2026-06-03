const { Follower, User } = require("../models");

exports.toggleFollow = async (req, res) => {
  try {
    const { targetUserId } = req.params; // जिसे फॉलो या अनफॉलो करना है
    const myId = req.user.id; // मैं खुद (Logged-in User)

    // 1. खुद को फॉलो करने से रोकें
    if (targetUserId === myId) {
      return res.status(400).json({ message: "You cannot follow yourself!" });
    }

    // 2. चेक करें कि वो यूजर सच में एक्सिस्ट करता है या नहीं
    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. चेक करें कि क्या पहले से फॉलो किया हुआ है?
    const existingFollow = await Follower.findOne({
      where: { followerId: myId, followingId: targetUserId },
    });

    if (existingFollow) {
      // पहले से फॉलो किया है, तो Unfollow कर दो
      await existingFollow.destroy();
      return res
        .status(200)
        .json({ success: true, message: "Unfollowed successfully" });
    } else {
      // फॉलो नहीं किया है, तो Follow कर दो
      await Follower.create({ followerId: myId, followingId: targetUserId });
      return res
        .status(201)
        .json({ success: true, message: "Followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
