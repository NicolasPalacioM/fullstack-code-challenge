import { Request, Response } from "express";
import { User } from "../models/user";

// Get all users
async function getAllUsers(req: Request, res: Response): Promise<Response> {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}

export { getAllUsers };
