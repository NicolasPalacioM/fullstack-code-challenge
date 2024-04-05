import { Answer, AnswerInput } from "../models/answer";

// Mock the pool module
jest.mock("../utils/db", () => ({
  query: jest.fn(),
}));

describe("create function", () => {
  it("should insert a new answer and return the created answer", async () => {
    // Mock data for testing
    const answerData: AnswerInput = {
      questionId: 1,
      userId: 1,
      content: "This is a test answer",
    };

    const expectedAnswer = {
      ...answerData,
      answerId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock the implementation of pool.query to return the expectedAnswer
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [expectedAnswer] });

    // Call the function with the mock data
    const result = await Answer.create(answerData);

    // Assertions to ensure the function behaves as expected
    expect(result).toEqual(expectedAnswer);
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO answers(question_id, user_id, content) VALUES($1, $2, $3) RETURNING *",
      [answerData.questionId, answerData.userId, answerData.content]
    );
  });
});

beforeEach(() => {
  jest.clearAllMocks(); // Clear the mock call history before each test
});

describe("findByIdAndUpdate function", () => {
  it("should update an existing answer for the correct user and return the updated answer", async () => {
    // Mock data for testing
    const answerId = 1;
    const updatedContent = "This is the updated content";
    const userId = 1;

    const expectedUpdatedAnswer = {
      answerId: answerId,
      questionId: 1,
      userId: userId,
      content: updatedContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock the implementation of pool.query to return the expectedUpdatedAnswer
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [expectedUpdatedAnswer],
    });

    // Call the function with the mock data
    const result = await Answer.findByIdAndUpdate(
      answerId,
      updatedContent,
      userId
    );

    // Assertions to ensure the function behaves as expected
    expect(result).toEqual(expectedUpdatedAnswer);
    expect(pool.query).toHaveBeenCalledWith(
      `
  UPDATE answers
  SET content = $2
  WHERE answer_id = $1 AND user_id = $3
  RETURNING *`,
      [answerId, updatedContent, userId] // Include userId in the query parameters
    );
  });

  it("should return null if the answer does not exist or does not belong to the user", async () => {
    const answerId = 999;
    const updatedContent = "This content will not be updated";
    const userId = 1;

    // Mock the implementation of pool.query to return an empty array
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    // Call the function with the mock data
    const result = await Answer.findByIdAndUpdate(
      answerId,
      updatedContent,
      userId
    );

    // Assert that the function returns null for non-existent answers or answers that do not belong to the user
    expect(result).toBeNull();
    expect(pool.query).toHaveBeenCalledWith(
      `
  UPDATE answers
  SET content = $2
  WHERE answer_id = $1 AND user_id = $3
  RETURNING *`,
      [answerId, updatedContent, userId] // Include userId in the query parameters
    );
  });
});

describe("findByIdAndDelete function", () => {
  it("should delete an existing answer belonging to the specified user and return the deleted answer", async () => {
    // Mock data for testing
    const answerId = 1; // Assume this ID corresponds to an existing answer
    const userId = 1; // Include userId in mock data

    const expectedDeletedAnswer = {
      answerId: answerId,
      questionId: 1,
      userId: userId,
      content: "This answer will be deleted",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock the implementation of pool.query to simulate successful deletion
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [expectedDeletedAnswer],
    });

    // Call the function with the mock data
    const result = await Answer.findByIdAndDelete(answerId, userId); // Include userId in the function call

    // Assertions to ensure the function behaves as expected
    expect(result).toEqual(expectedDeletedAnswer);
    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM answers WHERE answer_id = $1 AND user_id = $2 RETURNING *",
      [answerId, userId]
    );
  });

  it("should return null if the answer does not exist or does not belong to the specified user", async () => {
    const answerId = 999;
    const userId = 1;

    // Mock the implementation of pool.query to simulate no answer being deleted
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    // Call the function with the mock data
    const result = await Answer.findByIdAndDelete(answerId, userId); // Include userId in the function call

    // Assert that the function returns null for non-existent answers or answers not belonging to the user
    expect(result).toBeNull();
    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM answers WHERE answer_id = $1 AND user_id = $2 RETURNING *",
      [answerId, userId] // Include userId in the query parameters
    );
  });
});

describe("findByUser function", () => {
  it("should return all answers for a given user", async () => {
    // Mock data for testing
    const userId = 1;
    const mockAnswers = [
      {
        answerId: 1,
        questionId: 1,
        userId: userId,
        content: "First test answer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        answerId: 2,
        questionId: 2,
        userId: userId,
        content: "Second test answer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Mock the implementation of pool.query to return the mock answers
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockAnswers });

    // Call the function with the mock data
    const results = await Answer.findByUser(userId);

    // Assertions to ensure the function behaves as expected
    expect(results).toEqual(mockAnswers);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM answers WHERE user_id = $1",
      [userId]
    );
  });

  it("should return an empty array if no answers exist for the user", async () => {
    const userId = 999;

    // Mock the implementation of pool.query to return an empty array
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    // Call the function with the mock data
    const results = await Answer.findByUser(userId);

    // Assert that the function returns an empty array for users with no answers
    expect(results).toEqual([]);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM answers WHERE user_id = $1",
      [userId]
    );
  });
});

describe("findByQuestion function", () => {
  it("should return all answers for a given question", async () => {
    // Mock data for testing
    const questionId = 1;
    const mockAnswers = [
      {
        answerId: 1,
        questionId,
        userId: 1,
        content: "First test answer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        answerId: 2,
        questionId,
        userId: 1,
        content: "Second test answer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Mock the implementation of pool.query to return the mock answers
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockAnswers });

    // Call the function with the mock data
    const results = await Answer.findByQuestion(questionId);

    // Assertions to ensure the function behaves as expected
    expect(results).toEqual(mockAnswers);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM answers WHERE question_id = $1",
      [questionId]
    );
  });

  it("should return an empty array if no answers exist for the question", async () => {
    // Simulate the scenario where no answers exist for the question
    const questionId = 999; // Assuming this questionId has no answers

    // Mock the implementation of pool.query to return an empty array
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    // Call the function with the mock data
    const results = await Answer.findByQuestion(questionId);

    // Assert that the function returns an empty array for questions with no answers
    expect(results).toEqual([]);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM answers WHERE question_id = $1",
      [questionId]
    );
  });
});
