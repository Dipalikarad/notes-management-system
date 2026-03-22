require("dotenv").config();

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const flash = require("connect-flash");

const { connectDB } = require("./config/db");
const { sessionMiddleware } = require("./config/session");

const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/noteRoutes");
const profileRoutes = require("./routes/profileRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
      },
    },
  })
);

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use(sessionMiddleware());
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.isAuthenticated = !!req.userId;
  next();
});

// Routes
app.use("/", authRoutes);
app.use("/notes", notesRoutes);
app.use("/", profileRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("errors/404", { message: "Page not found" });
});

// Error handler
app.use(errorMiddleware);

const port = Number(process.env.PORT || 3000);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });