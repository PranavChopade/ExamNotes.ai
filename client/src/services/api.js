import axios from "axios";
import ENV from "../utils/ENV.js"
/**
 * API Service Configuration
 * Centralized API calls for the application
 */
export const api = axios.create({
  baseURL: ENV.backendUrl,
  withCredentials: true,
});

// ============================================================
// AUTH API CALLS
// ============================================================

/**
 * Register a new user
 * @param {Object} params - User registration data
 * @param {string} params.name - User's name
 * @param {string} params.email - User's email
 * @returns {Promise} API response with user data
 */
export const register = async ({ name, email }) => {
  try {
    const response = await api.post("/auth/v1/register", { name, email });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Logout the current user
 * @returns {Promise} API response confirming logout
 */
export const logout = async () => {
  try {
    const response = await api.get("/auth/v1/logout");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Get current user's profile
 * @returns {Promise} API response with user profile data
 */
export const profile = async () => {
  try {
    const response = await api.get("/auth/v1/profile");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// ============================================================
// NOTES API CALLS
// ============================================================

/**
 * Generate new exam notes using AI
 * @param {Object} params - Note generation parameters
 * @param {string} params.topic - Topic for the notes
 * @param {string} params.difficulty - Difficulty level (beginner/intermediate/advanced)
 * @returns {Promise} API response with generated notes
 */
export const generateNotes = async ({ topic, difficulty }) => {
  try {
    const response = await api.post("/notes/v1/generate", { topic, difficulty });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Get all notes for the authenticated user
 * @returns {Promise} API response with user's notes list
 */
export const getUserNotes = async () => {
  try {
    const response = await api.get("/notes/v1/my-notes");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Get a specific note by ID
 * @param {string} noteId - The note's unique identifier
 * @returns {Promise} API response with note details
 */
export const getNoteById = async (noteId) => {
  try {
    const response = await api.get(`/notes/v1/${noteId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Delete a note
 * @param {string} noteId - The note's unique identifier
 * @returns {Promise} API response confirming deletion
 */
export const deleteNote = async (noteId) => {
  try {
    const response = await api.delete(`/notes/v1/${noteId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};