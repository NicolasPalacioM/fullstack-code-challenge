import { Request, Response } from "express";
import { Form, FormInput } from "../models/form";

// Create a new form
async function createForm(req: Request, res: Response): Promise<Response> {
  try {
    // Extract userId and other form data from the request body
    const { userId, ...formContent } = req.body;

    // Check if userId is provided, since it's now expected in the request body
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Include userId in the formData object to be saved
    const formData = {
      ...formContent,
      userId,
    };

    const form = await Form.create(formData);

    // Respond with the created form
    return res.status(201).json(form);
  } catch (error) {
    // Handle any errors that occur during form creation
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}

// Edit an existing form
async function editForm(
  req: Request,
  res: Response,
  formId: number
): Promise<Response> {
  try {
    const {
      userId,
      title,
      description,
    }: Partial<FormInput> & { userId?: number } = req.body;

    // Check if the userId is provided in the request body
    if (!userId) {
      return res.status(400).json({ error: "UserId must be provided" });
    }

    const updatedform = await Form.findByIdAndUpdate(
      formId,
      { title, description },
      userId
    );
    if (updatedform) {
      return res.json(updatedform);
    } else {
      return res
        .status(404)
        .json({ error: "Form not found or userId mismatch" });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}

// Delete a form
async function deleteForm(
  req: Request,
  res: Response,
  formId: number
): Promise<Response> {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "UserId must be provided" });
    }

    const deletedForm = await Form.findByIdAndDelete(formId, userId);
    if (deletedForm) {
      return res.json({ success: true }); // Indicate success
    } else {
      return res
        .status(404)
        .json({ error: "Form not found or userId mismatch" });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}

// Get all forms
async function getAllForms(req: Request, res: Response): Promise<Response> {
  try {
    const forms = await Form.find();
    return res.json(forms);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}

export { createForm, deleteForm, editForm, getAllForms };
