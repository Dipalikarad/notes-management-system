const router = require("express").Router();

const authMiddleware = require("../middleware/authMiddleware");
const notesController = require("../controllers/notesController");
const { createNoteRules, updateNoteRules } = require("../validators/noteValidators");
const validateRequest = require("../middleware/validateRequest");

router.get("/dashboard", authMiddleware, notesController.dashboard);

router.get("/create", authMiddleware, notesController.newForm);
router.post(
  "/create",
  authMiddleware,
  createNoteRules(),
  validateRequest("/notes/create"),
  notesController.create
);

router.get("/edit/:id", authMiddleware, notesController.editForm);
router.post(
  "/edit/:id",
  authMiddleware,
  updateNoteRules(),
  validateRequest((req) => `/notes/edit/${req.params.id}`),
  notesController.update
);

router.post("/delete/:id", authMiddleware, notesController.remove);

module.exports = router;

