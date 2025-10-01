const express = require("express");
const imageRouter = require("./routes/imageRoutes");

// Create app
const app = express();

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

// Body parser - middleware that modifies incoming request data into json
app.use(express.json({ limit: "10kb" }));

// Serving static files
app.use(express.static("public"));

app.use("/images", imageRouter);

// ---- Error handling for routes

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Cannot find ${req.originalUrl} on this server!`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
