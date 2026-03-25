import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"]
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true
  },
  credits: {
    type: Number,
    default: 100,
    min: 0
  },
  isCreditsAvailable: {
    type: Boolean,
    default: true
  },
  notes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Notes",
    default: []
  }
}, { timestamps: true })

export const User = mongoose.model("User", userSchema)