const express = require("express");
const { body } = require("express-validator");
const {
  getAllUsers,
  getAllFlashcards,
  adminCreateFlashcard,
  adminUpdateFlashcard,
  adminDeleteFlashcard,
} = require("../controllers/flashcardController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.get("/flashcards", getAllFlashcards);

router.post(
  "/flashcards",
  [
    body("userId").notEmpty().withMessage("userId is required"),
    body("subject").trim().notEmpty().withMessage("Subject is required"),
    body("question").trim().notEmpty().withMessage("Question is required"),
    body("answer").trim().notEmpty().withMessage("Answer is required"),
    body("difficulty")
      .optional()
      .isIn(["easy", "medium", "hard"])
      .withMessage("Difficulty must be easy, medium, or hard"),
  ],
  adminCreateFlashcard
);

router.put(
  "/flashcards/:id",
  [
    body("difficulty")
      .optional()
      .isIn(["easy", "medium", "hard"])
      .withMessage("Difficulty must be easy, medium, or hard"),
  ],
  adminUpdateFlashcard
);

router.delete("/flashcards/:id", adminDeleteFlashcard);

module.exports = router;
