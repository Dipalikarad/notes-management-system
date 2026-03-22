const router = require("express").Router();

const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const { registerRules, loginRules } = require("../validators/authValidators");
const validateRequest = require("../middleware/validateRequest");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// Register page
router.get("/register", authController.getRegister);
router.post("/register", authLimiter, registerRules(), validateRequest("/register"), authController.register);

// Login page
router.get("/login", authController.getLogin);
router.post("/login", authLimiter, loginRules(), validateRequest("/login"), authController.login);

// Logout (POST recommended)
router.post("/logout", authController.logout);

module.exports = router;