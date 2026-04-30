const express = require("express");
const { body } = require("express-validator");
const {
  getFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} = require("../controllers/flashcardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getFlashcards);

router.post(
  "/",
  [
    body("subject").trim().notEmpty().withMessage("Subject is required"),
    body("question").trim().notEmpty().withMessage("Question is required"),
    body("answer").trim().notEmpty().withMessage("Answer is required"),
    body("difficulty")
      .optional()
      .isIn(["easy", "medium", "hard"])
      .withMessage("Difficulty must be easy, medium, or hard"),
  ],
  createFlashcard
);

router.put(
  "/:id",
  [
    body("subject").optional().trim().notEmpty().withMessage("Subject cannot be empty"),
    body("question").optional().trim().notEmpty().withMessage("Question cannot be empty"),
    body("answer").optional().trim().notEmpty().withMessage("Answer cannot be empty"),
    body("difficulty")
      .optional()
      .isIn(["easy", "medium", "hard"])
      .withMessage("Difficulty must be easy, medium, or hard"),
  ],
  updateFlashcard
);

router.delete("/:id", deleteFlashcard);

module.exports = router;
