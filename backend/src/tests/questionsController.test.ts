import {
  createQuestion,
  editQuestion,
  deleteQuestion,
  getQuestionsByForm,
} from "../controllers/questionsController";
import { Request, Response } from "express";
import { Question } from "../models/question";

// Mock the Question model's create method
jest.mock("../models/question", () => ({
  Question: {
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByForm: jest.fn(),
  },
}));

// Helper to create mock Express request and response objects
const createMock = (body: any = {}): [Partial<Request>, Partial<Response>] => {
  const req: Partial<Request> = {
    body,
  };

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  return [req, res];
};

describe("createQuestion", () => {
  beforeEach(() => {
    // Reset mocks before each test
    (Question.create as jest.Mock).mockReset();
  });

  it("successfully creates a question", async () => {
    const [req, res] = createMock({
      content: "Test content",
      userId: 1,
      formId: 1,
    });
    const mockQuestion = {
      id: 1,
      content: "Test content",
      userId: 1,
      formId: 1,
    };

    (Question.create as jest.Mock).mockResolvedValue(mockQuestion);

    await createQuestion(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockQuestion);
    expect(Question.create).toHaveBeenCalledWith({
      content: "Test content",
      userId: 1,
      formId: 1,
    });
  });

  it("returns a 400 status if userId is missing", async () => {
    const [req, res] = createMock({ content: "Test content" });

    await createQuestion(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "userId and formId are required",
    });
  });

  it("handles errors during question creation", async () => {
    const [req, res] = createMock({
      content: "Test content",
      userId: 1,
      formId: 1,
    });
    const error = new Error("Test error");

    (Question.create as jest.Mock).mockRejectedValue(error);

    await createQuestion(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});

describe("editQuestion", () => {
  // Define a common setup for the tests
  beforeEach(() => {
    // Reset mocks before each test to ensure clean state
    (Question.findByIdAndUpdate as jest.Mock).mockReset();
  });

  it("successfully updates a question", async () => {
    const [req, res] = createMock({ content: "Updated content", userId: 1 });
    const mockUpdatedQuestion = {
      id: 1,
      content: "Updated content",
      userId: 1,
    };
    const questionId = 1;
    const content = "Updated content";

    (Question.findByIdAndUpdate as jest.Mock).mockResolvedValue(
      mockUpdatedQuestion
    );

    await editQuestion(req as Request, res as Response, questionId);

    expect(res.json).toHaveBeenCalledWith(mockUpdatedQuestion);
    expect(Question.findByIdAndUpdate).toHaveBeenCalledWith(
      questionId,
      content,
      1
    );
  });

  it("returns a 400 status if userId is missing", async () => {
    const [req, res] = createMock({ content: "Updated content" });
    const questionId = 1;

    await editQuestion(req as Request, res as Response, questionId);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "UserId must be provided" });
  });

  it("returns a 404 status if question not found or userId mismatch", async () => {
    const [req, res] = createMock({ content: "Updated content", userId: 1 });
    const questionId = 2;

    (Question.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await editQuestion(req as Request, res as Response, questionId);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Question not found or userId mismatch",
    });
  });

  it("handles errors during question update", async () => {
    const [req, res] = createMock({ content: "Updated content", userId: 1 });
    const questionId = 1;
    const error = new Error("Test error");

    (Question.findByIdAndUpdate as jest.Mock).mockRejectedValue(error);

    await editQuestion(req as Request, res as Response, questionId);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});

describe("deleteQuestion", () => {
  // Define a common setup for the tests
  beforeEach(() => {
    // Reset mocks before each test to ensure a clean state
    (Question.findByIdAndDelete as jest.Mock).mockReset();
  });

  it("successfully deletes a question", async () => {
    const [req, res] = createMock({ userId: 1 });
    const questionId = 1;
    const mockDeletionResult = { success: true };

    (Question.findByIdAndDelete as jest.Mock).mockResolvedValue(
      mockDeletionResult
    );

    await deleteQuestion(req as Request, res as Response, questionId);

    expect(res.json).toHaveBeenCalledWith({ success: true });
    expect(Question.findByIdAndDelete).toHaveBeenCalledWith(questionId, 1);
  });

  it("returns a 400 status if userId is missing", async () => {
    const [req, res] = createMock({});
    const questionId = 1;

    await deleteQuestion(req as Request, res as Response, questionId);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "UserId must be provided" });
  });

  it("returns a 404 status if question not found or userId mismatch", async () => {
    const [req, res] = createMock({ userId: 1 });
    const questionId = 999;

    (Question.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    await deleteQuestion(req as Request, res as Response, questionId);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Question not found or userId mismatch",
    });
  });

  it("handles errors during question deletion", async () => {
    const [req, res] = createMock({ userId: 1 });
    const questionId = 1;
    const error = new Error("Test error");

    (Question.findByIdAndDelete as jest.Mock).mockRejectedValue(error);

    await deleteQuestion(req as Request, res as Response, questionId);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});

describe("getQuestionsByForm", () => {
  // Define a common setup for the tests
  beforeEach(() => {
    // Reset mocks before each test to ensure a clean state
    (Question.findByForm as jest.Mock).mockReset();
  });

  it("successfully retrieves questions for a given formId", async () => {
    const [req, res] = createMock();
    const formId = 1; // Example formId
    const mockQuestions = [{ question: "What is your name?" }];

    (Question.findByForm as jest.Mock).mockResolvedValue(mockQuestions);

    await getQuestionsByForm(req as Request, res as Response, formId);

    expect(res.json).toHaveBeenCalledWith(mockQuestions);
    expect(Question.findByForm).toHaveBeenCalledWith(formId);
  });

  it("handles errors gracefully", async () => {
    const [req, res] = createMock();
    const formId = 1;
    const error = new Error("Test error");

    (Question.findByForm as jest.Mock).mockRejectedValue(error);

    await getQuestionsByForm(req as Request, res as Response, formId);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});
