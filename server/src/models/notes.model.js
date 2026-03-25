import mongoose from "mongoose";

/**
 * Notes Schema
 * Stores generated exam notes for users
 * Each note generation costs 15 credits
 */
const notesSchema = new mongoose.Schema({
  // Reference to the user who created the notes
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User reference is required"]
  },
  // Topic/subject for the notes
  topic: {
    type: String,
    required: [true, "Topic is required"],
    trim: true
  },
  // The generated content
  content: {
    type: String,
    required: [true, "Content is required"]
  },
  // Difficulty level for the notes
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "intermediate"
  }
}, { timestamps: true });

export const Notes = mongoose.model("Notes", notesSchema);