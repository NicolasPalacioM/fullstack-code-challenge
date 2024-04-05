import { Request, Response } from "express";
import { Question, QuestionInput } from "../models/question";

// Create a new Question
async function createQuestion(req: Request, res: Response): Promise<Response> {
  try {
    // Extract formId along with userId and other question data from the request body
    const { userId, formId, content } = req.body;

    // Check if both userId and formId are provided, as they're now expected in the request body
    if (!userId || !formId) {
      return res.status(400).json({ error: "userId and formId are required" });
    }

    // Include userId and formId in the questionData object to be saved
    const questionData: QuestionInput = {
      userId,
      formId,
      content,
    };

    // Use the Question model to create a new question with the provided data
    const question = await Question.create(questionData);

    // Respond with the created question
    return res.status(201).json(question);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}

// Edit an existing Question
async function editQuestion(
  req: Request,
  res: Response,
  questionId: number
): Promise<Response> {
  try {
    const { userId, content } = req.body;

    // Check if the userId is provided in the request body
    if (!userId) {
      return res.status(400).json({ error: "UserId must be provided" });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      content,
      userId
    );
    if (updatedQuestion) {
      return res.json(updatedQuestion);
    } else {
      return res
        .status(404)
        .json({ error: "Question not found or userId mismatch" });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}

// Delete a Question
async function deleteQuestion(
  req: Request,
  res: Response,
  questionId: number
): Promise<Response> {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "UserId must be provided" });
    }

    const deletedQuestion = await Question.findByIdAndDelete(
      questionId,
      userId
    );
    if (deletedQuestion) {
      return res.json({ success: true });
    } else {
      return res
        .status(404)
        .json({ error: "Question not found or userId mismatch" });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}

// Get all Questions
async function getQuestionsByForm(
  req: Request,
  res: Response,
  formId: number
): Promise<Response> {
  try {
    const questions = await Question.findByForm(formId);

    return res.json(questions);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}

export { createQuestion, deleteQuestion, editQuestion, getQuestionsByForm };
