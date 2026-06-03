const express = require("express");
const dotenv = require("dotenv");
const { connectDB, sequelize } = require("./config/db");
const authRoutes = require("./Routes/authRoutes");
const postRoutes = require("./Routes/postRoutes");
const socialRoutes = require("./Routes/socialRoutes");
const userRoutes = require("./Routes/userRoutes");

dotenv.config();

const app = express();

app.use(express.json());
require("./Models/index"); // Import models to establish associations
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", socialRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to MySQL Social Media API" });
});

const PORT = process.env.DB_PORT || 25433;
app.listen(PORT, (error) => {
  if (error) {
    console.error("Error starting server: ", error);
  }
  console.log(`Server is running on port ${PORT}`);
});
