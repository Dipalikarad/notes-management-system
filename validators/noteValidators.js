const { body } = require("express-validator");

const createNoteRules = () => {
  return [
    body("title")
      .trim()
      .isLength({ min: 1, max: 120 })
      .withMessage("Title must be between 1 and 120 characters"),
    body("content")
      .trim()
      .optional({ nullable: true, checkFalsy: true })
      .isLength({ max: 5000 })
      .withMessage("Content must be at most 5000 characters"),
  ];
};

const updateNoteRules = () => {
  // same rules as create
  return createNoteRules();
};

module.exports = { createNoteRules, updateNoteRules };

