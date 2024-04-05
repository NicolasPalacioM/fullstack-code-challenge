import {
  createForm,
  deleteForm,
  editForm,
  getAllForms,
} from "../controllers/formsController";
import { Request, Response } from "express";
import { Form } from "../models/form";

// Type definitions for mocked request and response
type MockRequest = Partial<Request>;
type MockResponse = Partial<Response>;

// Utility function to create mock Express.js response
const createMockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock the Form.create method
jest.mock("../models/form", () => ({
  Form: {
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
  },
}));

describe("createForm controller function", () => {
  it("should successfully create a form and return 201 status", async () => {
    const req: MockRequest = {
      body: {
        title: "Test Form",
        description: "This is a test form",
        userId: 1,
      },
    };
    const res = createMockResponse();

    // Mock Form.create implementation
    (Form.create as jest.Mock).mockResolvedValue(req.body);

    await createForm(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
    expect(Form.create).toHaveBeenCalledWith(req.body);
  });

  it("should return 400 status if userId is missing", async () => {
    const req: MockRequest = {
      body: {
        title: "Test Form",
        description: "This is a test form",
      },
    };
    const res = createMockResponse();

    await createForm(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "userId is required" });
  });

  it("should handle errors and return 500 status", async () => {
    const req: MockRequest = {
      body: {
        title: "Test Form",
        description: "This is a test form",
        userId: 1,
      },
    };
    const res = createMockResponse();

    // Mock Form.create to throw an error
    (Form.create as jest.Mock).mockRejectedValue(new Error("Test error"));

    await createForm(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Test error" });
  });
});

describe("editForm controller function", () => {
  it("should successfully update a form and return the updated form data", async () => {
    const formId = 1; // Mock form ID
    const req: MockRequest = {
      body: {
        title: "Updated Test Form",
        description: "This is an updated test form",
        userId: 1,
      },
    };
    const res = createMockResponse();

    // Mock Form.findByIdAndUpdate implementation
    (Form.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      ...req.body,
      formId,
    });

    await editForm(req as Request, res as Response, formId);

    expect(res.json).toHaveBeenCalledWith({
      ...req.body,
      formId,
    });
    expect(Form.findByIdAndUpdate).toHaveBeenCalledWith(
      formId,
      { title: req.body.title, description: req.body.description },
      req.body.userId
    );
  });

  it("should return 400 status if userId is missing in the request body", async () => {
    const formId = 1; // Mock form ID
    const req: MockRequest = {
      body: {
        title: "Updated Test Form",
        description: "This is an updated test form",
      },
    };
    const res = createMockResponse();

    await editForm(req as Request, res as Response, formId);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "UserId must be provided" });
  });

  it("should return 404 status if the form is not found or userId mismatch", async () => {
    const formId = 1; // Mock form ID
    const req: MockRequest = {
      body: {
        title: "Nonexistent Form",
        description: "This form does not exist",
        userId: 99,
      },
    };
    const res = createMockResponse();

    // Mock Form.findByIdAndUpdate to simulate not finding the form
    (Form.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await editForm(req as Request, res as Response, formId);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Form not found or userId mismatch",
    });
  });
});

describe("getAllForms controller function", () => {
  it("should retrieve all forms and return them", async () => {
    const req: MockRequest = {};
    const res = createMockResponse();

    // Mock data simulating an array of forms
    const mockForms = [
      {
        title: "Test Form 1",
        description: "Description for Test Form 1",
        userId: 1,
        formId: 1,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        updatedAt: new Date("2021-01-02T00:00:00.000Z"),
      },
      {
        title: "Test Form 2",
        description: "Description for Test Form 2",
        userId: 2,
        formId: 2,
        createdAt: new Date("2021-02-01T00:00:00.000Z"),
        updatedAt: new Date("2021-02-02T00:00:00.000Z"),
      },
    ];

    // Mock Form.find implementation to return the mock forms
    (Form.find as jest.Mock).mockResolvedValue(mockForms);

    await getAllForms(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockForms);
    expect(Form.find).toHaveBeenCalled();
  });

  it("should return 500 status if an error occurs", async () => {
    const req: MockRequest = {}; // Empty request object
    const res = createMockResponse();

    // Mock Form.find to simulate an error
    const errorMessage = "An error occurred while fetching forms";
    (Form.find as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await getAllForms(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});
