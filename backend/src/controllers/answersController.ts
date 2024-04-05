import { Request, Response } from "express";
import { Answer, AnswerInput } from "../models/answer";

// Create a new Answer
export async function createAnswer(
  req: Request,
  res: Response,
  questionId: number
): Promise<Response> {
  try {
    // Extract content and userId from the request body
    const { content, userId } = req.body;

    // Check if userId is provided, since it's now expected in the request body
    if (!userId || !questionId) {
      return res
        .status(400)
        .json({ error: "userId and questionId are required" });
    }

    // Construct the answerData object including userId from the request body
    const answerData: AnswerInput = {
      questionId,
      userId,
      content,
    };

    const answer = await Answer.create(answerData);

    return res.status(201).json(answer);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}

export async function editAnswer(
  req: Request,
  res: Response,
  answerId: number
): Promise<Response> {
  try {
    const { userId, content } = req.body;

    // Check if the userId is provided in the request body
    if (!userId) {
      return res.status(400).json({ error: "UserId must be provided" });
    }

    const updatedAnswer = await Answer.findByIdAndUpdate(
      answerId,
      content,
      userId
    );
    if (updatedAnswer) {
      return res.json(updatedAnswer);
    } else {
      return res
        .status(404)
        .json({ error: "Answer not found or userId mismatch" });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}

// Delete an Answer
export async function deleteAnswer(
  req: Request,
  res: Response,
  answerId: number
): Promise<Response> {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "UserId must be provided" });
    }

    const deletedAnswer = await Answer.findByIdAndDelete(answerId, userId);
    if (deletedAnswer) {
      // If the answer is successfully deleted, return a 204 No Content response
      return res.status(204).send();
    } else {
      // If the answer wasn't found or the userId didn't match, return a 404 Not Found response
      return res
        .status(404)
        .json({ error: "Answer not found or userId mismatch" });
    }
  } catch (error) {
    // Return a 500 Internal Server Error response if an exception is caught
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

// Get all answers from a user for a specific question
export async function getQuestionAnswers(
  req: Request,
  res: Response,
  questionId: number
): Promise<Response> {
  try {
    const answers = await Answer.findByQuestion(questionId);
    return res.json(answers);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

// Get all answers from a user for a specific question
export async function getUserAnswers(
  req: Request,
  res: Response,
  userId: number
): Promise<Response> {
  try {
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const answers = await Answer.findByUser(userId);

    return res.json(answers);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}
