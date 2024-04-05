import { Router } from "express";
import {
  createQuestion,
  deleteQuestion,
  editQuestion,
  getQuestionsByForm,
} from "../controllers/questionsController";

const router = Router();

// Route to get all questions by form
router.get("/:formId", (req, res) => {
  const formId = parseInt(req.params.formId, 10);
  getQuestionsByForm(req, res, formId);
});

// Route to create a new question
router.post("/", (req, res) => {
  createQuestion(req, res);
});

// Route to edit a question
router.put("/:questionId", (req, res) => {
  const questionId = parseInt(req.params.questionId, 10);
  editQuestion(req, res, questionId);
});

// Route to delete a question
router.delete("/:questionId", (req, res) => {
  const questionId = parseInt(req.params.questionId, 10);
  deleteQuestion(req, res, questionId);
});

export { router as questionRoutes };
