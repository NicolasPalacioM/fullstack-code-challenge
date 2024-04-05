import { Router } from "express";
import {
  createAnswer,
  editAnswer,
  deleteAnswer,
  getQuestionAnswers,
  getUserAnswers,
} from "../controllers/answersController";

const router = Router();

// POST request to create a new answer linked to a question
router.post("/questions/:questionId", (req, res) => {
  const questionId = parseInt(req.params.questionId, 10);

  createAnswer(req, res, questionId);
});

// PUT request to edit an answer by ID, for a specific question
router.put("/:answerId", (req, res) => {
  const answerId = parseInt(req.params.answerId, 10);

  editAnswer(req, res, answerId);
});

// DELETE request to delete an answer by ID, for a specific question
router.delete("/:answerId", (req, res) => {
  const answerId = parseInt(req.params.answerId, 10);
  deleteAnswer(req, res, answerId);
});

// GET request to return all answers from a specific question
router.get("/questions/:questionId/", (req, res) => {
  const userId = parseInt(req.params.questionId, 10);
  getQuestionAnswers(req, res, userId);
});

// GET request to return all answers from a specific user for a specific question
router.get("/users/:userId/", (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  getUserAnswers(req, res, userId);
});

export { router as answerRoutes };
