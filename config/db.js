const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    port: parseInt(process.env.DB_PORT) || 25433,
    logging: false, // Set to console.log to see raw SQL queries in terminal
    timezone: "+05:30",
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      connectTimeout: 60000, // 10 seconds connection timeout
      ssl: {
        rejectUnauthorized: false, // For development only. In production, use proper SSL certificates.
      },
    },
  },
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("🎉 Connection has been established successfully.");
    // sync() creates tables automatically based on models.
    // alter: true updates tables if schemas change during development.
    //await sequelize.sync({ force: true });  // Force: true drops tables if they already exist or mysql indexes above 64 and re-creates them. Use with caution in production!
    //console.log("📦 All tables dropped and re-created successfully!");
    await sequelize.sync({ alter: true }); // Alter: true updates tables to match models without dropping them. Safer for development.
    // console.log("📦 All models synchronized.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1); // Exit with failure code
  }
};

module.exports = { sequelize, connectDB };
