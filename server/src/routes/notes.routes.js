import express from "express";
import {
  generateNotes,
  getUserNotes,
  getNoteById,
  deleteNote,
  generateQuizFromContent
} from "../controllers/notes.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(isAuth);

// Generate new notes (costs 15 credits)
router.post("/generate", generateNotes);

// Get all notes for the authenticated user
router.get("/my-notes", getUserNotes);

// Get a specific note by ID
router.get("/:noteId", getNoteById);

// Delete a note
router.delete("/:noteId", deleteNote);

// generate quiz
router.post("/gen-quiz", generateQuizFromContent)

export default router;