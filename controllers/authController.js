const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function getJwtCookieOptions() {
  const maxAgeMs = Number(process.env.COOKIE_MAX_AGE_MS || 24 * 60 * 60 * 1000);
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: maxAgeMs,
  };
}

module.exports = {
  getRegister: (req, res) => res.render("register"),
  getLogin: (req, res) => res.render("login"),

  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const exists = await User.findOne({ email });
      if (exists) {
        req.flash("error", "Email is already registered. Try logging in.");
        return res.redirect("/login");
      }

      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      // If you want auto-login, you can issue a JWT here.
      req.flash("success", "Account created successfully. Please login.");
      return res.redirect("/login");
    } catch (err) {
      // Duplicate email unique index, etc.
      if (err && err.code === 11000) {
        req.flash("error", "Email is already registered. Try logging in.");
        return res.redirect("/login");
      }
      return next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      res.cookie("token", token, getJwtCookieOptions());

      req.flash("success", "Logged in successfully.");
      return res.redirect("/notes/dashboard");
    } catch (err) {
      return next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      res.clearCookie("token");
      if (req.session) {
        req.session.destroy(() => {
          res.redirect("/login");
        });
        return;
      }
      return res.redirect("/login");
    } catch (err) {
      return next(err);
    }
  },
};

