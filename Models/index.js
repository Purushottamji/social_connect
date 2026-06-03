const User = require("./User");
const Post = require("./Post");
const Like = require("./Like");
const Comment = require("./Comment");
const Follower = require("./Follower");

User.hasMany(Post, { foreignKey: "userId", onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "userId" });

// 👇 New Many-to-Many for Likes
User.belongsToMany(Post, {
  tragedies: "Like",
  through: Like,
  foreignKey: "userId",
});
Post.belongsToMany(User, {
  tragedies: "Like",
  through: Like,
  foreignKey: "postId",
});

// User can make many comments
User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "userId" });

// Post can have many comments
Post.hasMany(Comment, { foreignKey: "postId", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "postId" });

// 👇 Self-Referencing Many-to-Many Relationship
// Users whom I follow (My Following)
User.belongsToMany(User, {
  as: "Following",
  through: Follower,
  foreignKey: "followerId",
  otherKey: "followingId",
});

// Users who follow me (My Followers)
User.belongsToMany(User, {
  as: "Followers",
  through: Follower,
  foreignKey: "followingId",
  otherKey: "followerId",
});

module.exports = { User, Post, Like, Comment, Follower };
