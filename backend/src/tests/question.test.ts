import { Question, QuestionInput } from "../models/question";
import pool from "../utils/db";

// Mock the pg Pool
jest.mock("../utils/db", () => {
  return {
    query: jest.fn(),
  };
});

describe("create function", () => {
  it("successfully inserts a question and returns the new question object", async () => {
    const mockQuestionInput: QuestionInput = {
      content: "What is TypeScript?",
      userId: 1,
      formId: 1,
    };

    const mockQuestionOutput = {
      questionId: 1,
      content: "What is TypeScript?",
      userId: 1,
      formId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock the pool.query response
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [mockQuestionOutput],
    });

    const result = await Question.create(mockQuestionInput);

    // Check if pool.query was called correctly
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO questions(content, user_id, forms_id) VALUES($1, $2, $3) RETURNING *",
      [
        mockQuestionInput.content,
        mockQuestionInput.userId,
        mockQuestionInput.formId,
      ]
    );

    // Check if the result is as expected
    expect(result).toEqual(mockQuestionOutput);
  });
});

beforeEach(() => {
  jest.clearAllMocks(); // Clear the mock call history before each test
});

describe("Question.findByIdAndUpdate", () => {
  it("successfully updates a question and returns the updated question object", async () => {
    const questionId = 1;
    const userId = 1;
    const content = "Updated question content?";

    const mockUpdatedQuestion = {
      questionId,
      content,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock the pool.query response for the update
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [mockUpdatedQuestion],
    });

    const result = await Question.findByIdAndUpdate(
      questionId,
      content,
      userId
    );

    // Check if pool.query was called correctly
    expect(pool.query).toHaveBeenCalledWith(
      `
  UPDATE questions
  SET content = $2
  WHERE question_id = $1 AND user_id = $3
  RETURNING *`,
      [questionId, content, userId]
    );

    // Check if the result is as expected
    expect(result).toEqual(mockUpdatedQuestion);
  });

  it("returns null if the question does not exist or the userId does not match", async () => {
    const questionId = 999; // Example non-existent questionId
    const userId = 1;
    const content = "Non-existent question.";

    // Mock the pool.query response to simulate no rows returned
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    const result = await Question.findByIdAndUpdate(
      questionId,
      content,
      userId
    );

    // Expect null to be returned because the question does not exist or the userId doesn't match
    expect(result).toBeNull();
  });
});

describe("findByIdAndDelete function", () => {
  it("successfully deletes a question and returns the deleted question object", async () => {
    const questionId = 1;
    const userId = 1;

    const mockDeletedQuestion = {
      questionId: 1,
      content: "Deleted question content?",
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock the pool.query response for the deletion
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [mockDeletedQuestion],
    });

    const result = await Question.findByIdAndDelete(questionId, userId);

    // Check if pool.query was called correctly
    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM questions WHERE question_id = $1 AND user_id = $2 RETURNING *",
      [questionId, userId]
    );

    // Check if the result is as expected
    expect(result).toEqual(mockDeletedQuestion);
  });

  it("returns null if the question does not exist or the userId does not match", async () => {
    const questionId = 999; // Non-existent questionId for testing
    const userId = 1;

    // Mock the pool.query response to simulate no rows returned
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    const result = await Question.findByIdAndDelete(questionId, userId);

    // Expect null to be returned because the question does not exist or the userId doesn't match
    expect(result).toBeNull();
  });
});

describe("findByForm function", () => {
  it("fetches questions based on formId and returns an array of questions", async () => {
    const mockFormId = 1;

    // Mocking an array of questions as a response from the database
    const mockQuestions = [
      {
        questionId: 1,
        content: "What is Node.js?",
        userId: 1,
        formId: mockFormId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        questionId: 2,
        content: "Explain RESTful APIs?",
        userId: 2,
        formId: mockFormId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Mock the pool.query response to simulate fetching questions from the database
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: mockQuestions,
    });

    // Call findByForm with a mock formId
    const result = await Question.findByForm(mockFormId);

    // Check if pool.query was called with the correct SQL query and parameters
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM answers WHERE form_id = $1",
      [mockFormId]
    );

    // Check if the result matches the mocked array of questions
    expect(result).toEqual(mockQuestions);
  });
});
