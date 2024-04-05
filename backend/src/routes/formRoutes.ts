import { Router } from "express";
import {
  createForm,
  deleteForm,
  editForm,
  getAllForms,
} from "../controllers/formsController";

const router = Router();

// Route to get all forms
router.get("/", (req, res) => {
  getAllForms(req, res);
});

// Route to create a new form
router.post("/", (req, res) => {
  createForm(req, res);
});

// Route to edit a form
router.put("/:formId", (req, res) => {
  const formId = parseInt(req.params.formId, 10);
  editForm(req, res, formId);
});

// Route to delete a form
router.delete("/:formId", (req, res) => {
  const formId = parseInt(req.params.formId, 10);
  deleteForm(req, res, formId);
});

export { router as formRoutes };
