// Import statements for types
import { Request, Response } from "express";
import { User } from "../models/user";
import { getAllUsers } from "../controllers/usersController";

// Mocking the User model
jest.mock("../models/user", () => ({
  User: {
    find: jest.fn().mockResolvedValue([
      {
        user_id: 1,
        username: "testUser1",
        email: "test1@example.com",
        password: "pass1",
        created_at: new Date(),
      },
    ]),
  },
}));

// Helper function to create mock Express objects
const createMock = (
  body = {},
  query = {},
  params = {}
): [Partial<Request>, Partial<Response>] => {
  const req: Partial<Request> = {
    body,
    query,
    params,
  };
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return [req, res as Response];
};

describe("getAllUsers Controller", () => {
  it("should return all users", async () => {
    // Mock users data
    const users = [
      {
        user_id: 1,
        username: "testUser1",
        email: "test1@example.com",
        password: "pass1",
        created_at: new Date(),
      },
    ];

    // Mocking User.find to return the mock users
    (User.find as jest.Mock).mockResolvedValue(users);

    // Creating mock request and response objects
    const [req, res] = createMock();

    // Calling the controller function
    await getAllUsers(req as Request, res as Response);

    // Assertions
    expect(User.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(users);
  });

  it("should handle errors correctly", async () => {
    // Mocking User.find to throw an error
    (User.find as jest.Mock).mockRejectedValue(new Error("Test error"));

    // Creating mock request and response objects
    const [req, res] = createMock();

    // Calling the controller function
    await getAllUsers(req as Request, res as Response);

    // Assertions
    expect(User.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Test error" });
  });
});
