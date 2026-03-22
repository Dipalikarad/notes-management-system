const { body } = require("express-validator");

const registerRules = () => {
  return [
    body("name")
      .trim()
      .isLength({ min: 2, max: 80 })
      .withMessage("Name must be between 2 and 80 characters"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email address")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8, max: 64 })
      .withMessage("Password must be at least 8 characters"),
  ];
};

const loginRules = () => {
  return [
    body("email").trim().isEmail().withMessage("Enter a valid email address").normalizeEmail(),
    body("password").isLength({ min: 1 }).withMessage("Password is required"),
  ];
};

module.exports = { registerRules, loginRules };

