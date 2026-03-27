import axios from "axios";
import { ENV } from "../utils/ENV.js"

export const api = axios.create({
  baseURL: ENV.backendUrl,
  withCredentials: true,
});

export const register = async ({ name, email }) => {
  try {
    const response = await api.post("/auth/v1/register", { name, email });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.get("/auth/v1/logout");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const profile = async () => {
  try {
    const response = await api.get("/auth/v1/profile");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const generateNotes = async ({ topic, difficulty }) => {
  try {
    const response = await api.post("/notes/v1/generate", { topic, difficulty });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const getUserNotes = async () => {
  try {
    const response = await api.get("/notes/v1/my-notes");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const getNoteById = async (noteId) => {
  try {
    const response = await api.get(`/notes/v1/${noteId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const deleteNote = async (noteId) => {
  try {
    const response = await api.delete(`/notes/v1/${noteId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const generateQuiz = async (content) => {
  try {
    const response = await api.post(`/notes/v1/gen-quiz`, { content });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};