import { Request, Response } from "express";
import {
  createAnswer,
  editAnswer,
  deleteAnswer,
  getUserAnswers,
} from "../controllers/answersController";
import { Answer } from "../models/answer";

// Mock the Answer model
jest.mock("../models/answer", () => ({
  Answer: {
    create: jest.fn(),
  },
}));

// Helper function to create mock Express request and response objects
const createMock = <T>() => {
  let res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as T;
};

describe("createAnswer", () => {
  it("should create an answer and return 201 status code", async () => {
    const req = {
      body: { content: "Test answer", userId: 1 },
    } as unknown as Request;
    const res = createMock<Response>();
    const questionId = 1;

    const answerData = {
      questionId: questionId,
      userId: req.body.userId,
      content: req.body.content,
      answerId: 123,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock the Answer.create method to resolve with the answerData
    (Answer.create as jest.Mock).mockResolvedValue(answerData);

    // Call the function
    await createAnswer(req, res, questionId);

    // Assertions to reflect the function's reliance on request body for userId
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(answerData);
    expect(Answer.create).toHaveBeenCalledWith({
      questionId: questionId,
      userId: req.body.userId,
      content: req.body.content,
    });
  });

  it("should return 400 if userId is not provided", async () => {
    // Preparing a request mock without userId
    const req = {
      body: { content: "Test answer" }, // Missing userId
    } as unknown as Request;
    const res = createMock<Response>();
    const questionId = 1;

    // Call the function without mocking Answer.create to test input validation
    await createAnswer(req, res, questionId);

    // Assertions to check if the function correctly handles missing userId
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "userId and questionId are required",
    });
  });

  it("should handle errors and return 500 status code", async () => {
    const req = {
      body: { content: "Test answer", userId: 1 },
    } as unknown as Request;
    const res = createMock<Response>();
    const questionId = 1;
    const errorMessage = "Error creating answer";

    // Mock the Answer.create method to reject with an error
    (Answer.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Call the function
    await createAnswer(req, res, questionId);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: errorMessage,
    });
  });
});

(Answer.findByIdAndUpdate as jest.Mock) = jest.fn();

describe("editAnswer", () => {
  it("should update an answer and return the updated answer if userId matches", async () => {
    const req = {
      body: { content: "Updated answer", userId: 1 },
    } as unknown as Request;
    const res = createMock<Response>();
    const answerId = 123;
    const updatedAnswer = {
      questionId: 1,
      userId: 1,
      content: "Updated answer",
      answerId: 123,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock the Answer.findByIdAndUpdate method to resolve with the updatedAnswer
    (Answer.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedAnswer);

    // Call the function
    await editAnswer(req, res, answerId);

    // Assertions
    expect(res.json).toHaveBeenCalledWith(updatedAnswer);
    expect(Answer.findByIdAndUpdate).toHaveBeenCalledWith(
      answerId,
      req.body.content,
      req.body.userId
    );
  });

  it("should return 400 if userId is not provided", async () => {
    const req = {
      body: { content: "Updated answer" }, // Missing userId
    } as unknown as Request;
    const res = createMock<Response>();
    const answerId = 123; // Example answerId

    // Call the function without mocking Answer.findByIdAndUpdate to test the early return
    await editAnswer(req, res, answerId);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "UserId must be provided" });
  });

  it("should return 404 if answer not found or userId mismatch", async () => {
    const req = {
      body: { content: "Nonexistent answer", userId: 2 },
    } as unknown as Request;
    const res = createMock<Response>();
    const answerId = 456; // Example answerId not found

    // Mock the Answer.findByIdAndUpdate method to resolve with null
    (Answer.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    // Call the function
    await editAnswer(req, res, answerId);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Answer not found or userId mismatch",
    });
  });

  it("should handle errors and return 500 status code", async () => {
    const req = {
      body: { content: "Error case", userId: 3 },
    } as unknown as Request;
    const res = createMock<Response>();
    const answerId = 789;
    const errorMessage = "Error updating answer";

    // Mock the Answer.findByIdAndUpdate method to reject with an error
    (Answer.findByIdAndUpdate as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    // Call the function
    await editAnswer(req, res, answerId);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: errorMessage,
    });
  });
});

(Answer.findByIdAndDelete as jest.Mock) = jest.fn();

describe("deleteAnswer", () => {
  it("should successfully delete an answer and return a 204 status code if userId matches", async () => {
    // Now including userId in the request object
    const req = {
      body: { userId: 1 },
    } as unknown as Request;
    const res = createMock<Response>();
    const answerId = 123;

    // Mock the Answer.findByIdAndDelete method to simulate successful deletion
    (Answer.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

    // Call the function with the updated signature
    await deleteAnswer(req, res, answerId);

    // Assertions to verify successful deletion and correct parameters passed
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(Answer.findByIdAndDelete).toHaveBeenCalledWith(
      answerId,
      req.body.userId
    );
  });

  it("should return 400 if userId is not provided", async () => {
    // Request object without userId
    const req = {
      body: { content: "Updated answer" },
    } as unknown as Request;
    const res = createMock<Response>();
    const answerId = 123;

    // Directly calling the function to test validation
    await deleteAnswer(req, res, answerId);

    // Assertions for missing userId
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "UserId must be provided" });
  });

  it("should return 404 if the answer to delete is not found or userId mismatch", async () => {
    // Request object including userId
    const req = {
      body: { userId: 2 },
    } as unknown as Request;
    const res = createMock<Response>();
    const answerId = 456;

    // Mock the Answer.findByIdAndDelete method to resolve with null indicating not found or mismatch
    (Answer.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    // Call the function with the updated parameters
    await deleteAnswer(req, res, answerId);

    // Assertions for not found or userId mismatch scenario
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Answer not found or userId mismatch",
    });
    expect(Answer.findByIdAndDelete).toHaveBeenCalledWith(
      answerId,
      req.body.userId
    );
  });

  it("should handle errors and return a 500 status code", async () => {
    // Including userId in the request object for an error scenario
    const req = {
      body: { userId: 3 },
    } as unknown as Request;
    const res = createMock<Response>();
    const answerId = 789;
    const errorMessage = "Error deleting answer";

    // Mock the Answer.findByIdAndDelete method to reject with an error
    (Answer.findByIdAndDelete as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    // Call the function
    await deleteAnswer(req, res, answerId);

    // Assertions to verify error handling
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    expect(Answer.findByIdAndDelete).toHaveBeenCalledWith(
      answerId,
      req.body.userId
    );
  });
});

(Answer.findByUser as jest.Mock) = jest.fn();

describe("getUserAnswers", () => {
  it("should retrieve user answers and return them", async () => {
    const req = {} as Request;
    const res = createMock<Response>();
    const userId = 1;
    const answers = [
      {
        questionId: 1,
        userId: userId,
        content: "Answer 1",
        answerId: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        questionId: 2,
        userId: userId,
        content: "Answer 2",
        answerId: 456,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Mock the Answer.find method to resolve with the answers array
    (Answer.findByUser as jest.Mock).mockResolvedValue(answers);

    // Call the function
    await getUserAnswers(req, res, userId);

    // Assertions
    expect(res.json).toHaveBeenCalledWith(answers);
    expect(Answer.findByUser).toHaveBeenCalledWith(userId);
  });

  it("should handle errors and return a 500 status code", async () => {
    const req = {} as Request; // Empty request object
    const res = createMock<Response>();
    const userId = 2; // Example userId for an error scenario
    const errorMessage = "Error retrieving answers";

    // Mock the Answer.findByUser method to reject with an error
    (Answer.findByUser as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Call the function
    await getUserAnswers(req, res, userId);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: errorMessage,
    });
    expect(Answer.findByUser).toHaveBeenCalledWith(userId);
  });
});
