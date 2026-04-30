const { validationResult } = require("express-validator");
const Flashcard = require("../models/Flashcard");
const User = require("../models/User");

const getFlashcards = async (req, res) => {
  const flashcards = await Flashcard.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.status(200).json(flashcards);
};

const createFlashcard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const flashcard = await Flashcard.create({
    ...req.body,
    user: req.user._id,
  });

  return res.status(201).json(flashcard);
};

const updateFlashcard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const flashcard = await Flashcard.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!flashcard) {
    return res.status(404).json({ message: "Flashcard not found" });
  }

  const updated = await Flashcard.findByIdAndUpdate(flashcard._id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json(updated);
};

const deleteFlashcard = async (req, res) => {
  const flashcard = await Flashcard.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!flashcard) {
    return res.status(404).json({ message: "Flashcard not found" });
  }

  await flashcard.deleteOne();
  return res.status(200).json({ message: "Flashcard deleted" });
};

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return res.status(200).json(users);
};

const getAllFlashcards = async (req, res) => {
  const flashcards = await Flashcard.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 });
  return res.status(200).json(flashcards);
};

const adminCreateFlashcard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, subject, question, answer, difficulty, nextReviewAt } = req.body;
  const targetUser = await User.findById(userId);
  if (!targetUser) {
    return res.status(404).json({ message: "Target user not found" });
  }

  const flashcard = await Flashcard.create({
    user: userId,
    subject,
    question,
    answer,
    difficulty,
    nextReviewAt: nextReviewAt || null,
  });

  return res.status(201).json(flashcard);
};

const adminUpdateFlashcard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const flashcard = await Flashcard.findById(req.params.id);
  if (!flashcard) {
    return res.status(404).json({ message: "Flashcard not found" });
  }

  const allowed = ["subject", "question", "answer", "difficulty", "nextReviewAt", "userId"];
  const nextData = {};
  for (const key of allowed) {
    if (typeof req.body[key] !== "undefined") {
      nextData[key === "userId" ? "user" : key] = req.body[key];
    }
  }

  if (nextData.user) {
    const targetUser = await User.findById(nextData.user);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }
  }

  const updated = await Flashcard.findByIdAndUpdate(flashcard._id, nextData, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json(updated);
};

const adminDeleteFlashcard = async (req, res) => {
  const flashcard = await Flashcard.findById(req.params.id);
  if (!flashcard) {
    return res.status(404).json({ message: "Flashcard not found" });
  }

  await flashcard.deleteOne();
  return res.status(200).json({ message: "Flashcard deleted by admin" });
};

module.exports = {
  getFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  getAllUsers,
  getAllFlashcards,
  adminCreateFlashcard,
  adminUpdateFlashcard,
  adminDeleteFlashcard,
};
