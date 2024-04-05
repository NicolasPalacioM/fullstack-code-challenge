import { Router } from "express";
import { getAllUsers } from "../controllers/usersController";

const router = Router();

// GET request to return all answers from a specific user for a specific question
router.get("/", (req, res) => {
  getAllUsers(req, res);
});

export { router as userRoutes };
