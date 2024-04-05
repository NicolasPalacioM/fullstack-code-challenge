// user.test.ts
import { User } from "../models/user";
import pool from "../utils/db";

// Mocking the pool module
jest.mock("../utils/db", () => ({
  query: jest.fn(),
}));

describe("User.find", () => {
  it("should return a list of users", async () => {
    // Mock data to be returned by the query
    const users = [
      {
        user_id: 1,
        username: "john_doe",
        email: "john@example.com",
        password: "hashedpassword123",
        created_at: new Date(),
      },
      // Add more user objects as needed
    ];

    // Mocking the implementation of pool.query to return the users array
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: users });

    // Call the method
    const result = await User.find();

    // Assertions to verify the behavior
    expect(result).toEqual(users);
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM questions");
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
