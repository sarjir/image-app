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

// Routes
app.use("/images", imageRouter);

// Serving static files
app.use(express.static("public"));

// Catching uncaught routes
app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: "fail",
    message: `Cannot find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
