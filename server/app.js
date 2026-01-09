require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./app/config/db");
const errorHandler = require("./app/middleware/error");

// Connect DB
connectDB();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(helmet()); // Enabled helmet for security headers
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "app", "uploads")));

// Routes
const authRoutes = require("./app/routes/auth.routes");
const userRoutes = require("./app/routes/user.routes");
const productRoutes = require("./app/routes/product.routes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "E-Commerce APIs are running successfully",
  });
});

// Global Error Handler (must be last)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
