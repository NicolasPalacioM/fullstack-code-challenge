import { Form, FormInput } from "../models/form";
import pool from "../utils/db";

// Mocking the pool module imported in the create function file
jest.mock("../utils/db", () => ({
  query: jest.fn(),
}));

describe("createForm", () => {
  it("should create a new form and return the form data", async () => {
    // Mock data simulating a form input and the expected database return value
    const formInput: FormInput = {
      title: "Test Form",
      description: "This is a test form",
      userId: 1,
    };

    const formOutput = {
      ...formInput,
      formId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mocking the pool.query implementation to return the mock form output
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [formOutput],
    });

    // Call the function with the mock input
    const result = await Form.create(formInput);

    // Assertions to ensure the function behaves as expected
    expect(result).toEqual(formOutput);
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO forms(title, description, user_id) VALUES($1, $2, $3) RETURNING *",
      [formInput.title, formInput.description, formInput.userId]
    );
  });
});

describe("findByIdAndUpdate", () => {
  it("should update an existing form and return the updated form data", async () => {
    // Mock data for the form update
    const formId = 1; // Assuming an existing formId
    const updateData: Partial<FormInput> = {
      title: "Updated Test Form",
      description: "This is an updated test form",
    };
    const userId = 1;

    const updatedForm = {
      ...updateData,
      formId,
      userId,
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date(),
    };

    // Mocking the pool.query implementation to return the mock updated form
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [updatedForm],
    });

    // Call the function with the mock data
    const result = await Form.findByIdAndUpdate(formId, updateData, userId);

    // Construct the expected SQL query part for the SET clause
    const setClause = Object.entries(updateData)
      .map(([key], index) => `${key} = $${index + 3}`)
      .join(", ");

    // Assertions to ensure the function behaves as expected
    expect(result).toEqual(updatedForm);
    expect(pool.query).toHaveBeenCalledWith(
      `
    UPDATE forms 
    SET ${setClause}
    WHERE form_id = $1 AND user_id = $2
    RETURNING *`,
      [formId, userId, ...Object.values(updateData)]
    );
  });
});

describe("findByIdAndDelete", () => {
  it("should delete an existing form and return the deleted form data", async () => {
    // Mock data for the form to delete
    const formId = 1;
    const userId = 1;
    const deletedForm = {
      title: "Test Form",
      description: "This is a test form",
      userId,
      formId,
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-02"),
    };

    // Mocking the pool.query implementation to simulate a successful deletion
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [deletedForm],
    });

    // Call the function with the mock data
    const result = await Form.findByIdAndDelete(formId, userId);

    // Assertions to ensure the function behaves as expected
    expect(result).toEqual(deletedForm);
    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM forms WHERE form_id = $1 AND user_id = $2 RETURNING *",
      [formId, userId]
    );
  });

  it("should return null if the form does not exist or the userId does not match", async () => {
    const formId = 99;
    const userId = 1;

    // Mocking the pool.query to simulate no rows returned
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [],
    });

    // Call the function with the mock data
    const result = await Form.findByIdAndDelete(formId, userId);

    // Assertion to ensure the function returns null in this case
    expect(result).toBeNull();
    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM forms WHERE form_id = $1 AND user_id = $2 RETURNING *",
      [formId, userId]
    );
  });
});

describe("find", () => {
  it("should retrieve all forms from the database", async () => {
    // Mock data simulating the database forms
    const forms = [
      {
        title: "Test Form 1",
        description: "This is the first test form",
        userId: 1,
        formId: 1,
        createdAt: new Date("2023-01-01T00:00:00.000Z"),
        updatedAt: new Date("2023-01-02T00:00:00.000Z"),
      },
      {
        title: "Test Form 2",
        description: "This is the second test form",
        userId: 2,
        formId: 2,
        createdAt: new Date("2023-02-01T00:00:00.000Z"),
        updatedAt: new Date("2023-02-02T00:00:00.000Z"),
      },
    ];

    // Mocking the pool.query implementation to return the mock forms
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: forms });

    // Call the function
    const result = await Form.find();

    // Assertions to ensure the function behaves as expected
    expect(result).toEqual(forms);
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM forms");
  });
});
