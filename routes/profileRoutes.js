const router = require("express").Router();

const authMiddleware = require("../middleware/authMiddleware");
const profileController = require("../controllers/profileController");
const { changePasswordRules } = require("../validators/profileValidators");
const validateRequest = require("../middleware/validateRequest");

router.get("/profile", authMiddleware, profileController.profile);

router.get("/profile/change-password", authMiddleware, profileController.changePasswordForm);
router.post(
  "/profile/change-password",
  authMiddleware,
  changePasswordRules(),
  validateRequest("/profile/change-password"),
  profileController.changePassword
);

module.exports = router;

