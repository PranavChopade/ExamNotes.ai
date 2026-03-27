import { useDispatch } from "react-redux";
import { generateNotes, getUserNotes, getNoteById, deleteNote, generateQuiz } from "../services/api";
import { setNotes } from "../redux/notesSlice";

export const useNotes = () => {
  const dispatch = useDispatch();

  const generateNotesHandler = async ({ topic, difficulty }) => {
    try {
      const data = await generateNotes({ topic, difficulty });
      // NOTE: generateNotes API returns { notes: SINGLE_OBJECT }
      // We must NOT dispatch this to Redux state.notes (which expects an array)
      // The Dashboard will refetch all notes via getUserNotesHandler after generation
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getUserNotesHandler = async () => {
    try {
      const data = await getUserNotes();
      dispatch(setNotes(data.notes || []));
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getNoteByIdHandler = async (noteId) => {
    try {
      const data = await getNoteById(noteId);
      // NOTE: getNoteById API returns { note: SINGLE_OBJECT }
      // We must NOT dispatch this to Redux state.notes (which expects an array)
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const deleteNoteHandler = async (noteId) => {
    try {
      const data = await deleteNote(noteId);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const generateQuizHandler = async (content) => {
    try {
      const data = await generateQuiz(content);
      return data;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  return {
    generateNotesHandler,
    getUserNotesHandler,
    getNoteByIdHandler,
    deleteNoteHandler,
    generateQuizHandler
  };
};
