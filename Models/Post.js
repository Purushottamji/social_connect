const { DataTypes } = require("sequelize");
const db = require("../config/db");
const sequelize = db.sequelize;

const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true, // अगर सिर्फ टेक्स्ट पोस्ट है तो यह खाली रहेगा
  },
  mediaType: {
    type: DataTypes.ENUM("text", "image", "video"), // इससे कैटेगरी फिक्स हो जाएगी
    defaultValue: "text",
  },
});

module.exports = Post;
