const { body } = require("express-validator");

const changePasswordRules = () => {
  return [
    body("currentPassword").trim().isLength({ min: 1 }).withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 8, max: 64 })
      .withMessage("New password must be at least 8 characters"),
    body("confirmPassword")
      .custom((value, { req }) => value === req.body.newPassword)
      .withMessage("New password and confirmation do not match"),
  ];
};

module.exports = { changePasswordRules };

