const bcrypt = require("bcrypt");
const User = require("../models/User");

module.exports = {
  profile: async (req, res, next) => {
    try {
      const user = await User.findById(req.userId).select("name email");
      if (!user) {
        req.flash("error", "User not found. Please login again.");
        return res.redirect("/login");
      }

      return res.render("profile", { user });
    } catch (err) {
      return next(err);
    }
  },

  changePasswordForm: async (req, res) => {
    return res.render("changePassword");
  },

  changePassword: async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.userId).select("+password");
      if (!user) {
        req.flash("error", "User not found. Please login again.");
        return res.redirect("/login");
      }

      const ok = await bcrypt.compare(currentPassword, user.password);
      if (!ok) {
        req.flash("error", "Current password is incorrect.");
        return res.redirect("/profile/change-password");
      }

      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
      user.password = await bcrypt.hash(newPassword, saltRounds);
      await user.save();

      // JWT contains only userId, so no need to re-issue token.
      req.flash("success", "Password changed successfully.");
      return res.redirect("/profile");
    } catch (err) {
      return next(err);
    }
  },
};

