const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Follower = sequelize.define("Follower", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  // यहाँ Sequelize खुद 'followerId' और 'followingId' दो Columns बना देगा।
});

module.exports = Follower;
