import { Notes } from "../models/notes.model.js";
import { User } from "../models/user.model.js";
import { AiModel } from "../services/gemini.services.js";

/**
 * Generate new notes
 * Requires authentication and sufficient credits
 */
export const generateNotes = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    const userId = req.userId;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.credits < 15) {
      return res.status(400).json({
        message: "Insufficient credits. Please purchase more credits.",
        currentCredits: user.credits,
        requiredCredits: 15,
      });
    }

    const generatedContent = await AiModel({ topic, difficulty });

    if (!generatedContent) {
      return res.status(500).json({
        message: "Failed to generate notes. Please try again.",
      });
    }


    user.credits -= 15;
    user.isCreditsAvailable = user.credits > 0;
    await user.save();

    const notes = await Notes.create({
      user: userId,
      topic,
      content: generatedContent,
      difficulty: difficulty,
    });

    user.notes.push(notes._id);
    await user.save();

    res.status(201).json({
      message: "Notes generated successfully",
      notes: {
        _id: notes._id,
        topic: notes.topic,
        content: notes.content,
        difficulty: notes.difficulty,
        createdAt: notes.createdAt,
      },
      creditsRemaining: user.credits,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all notes for the authenticated user
 */
export const getUserNotes = async (req, res) => {
  try {
    const userId = req.userId;

    const notes = await Notes.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a specific note by ID
 */
export const getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.userId;

    const note = await Notes.findOne({ _id: noteId, user: userId }).select(
      "-__v"
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a note
 */
export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.userId;

    const note = await Notes.findOneAndDelete({ _id: noteId, user: userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { notes: noteId },
    });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};