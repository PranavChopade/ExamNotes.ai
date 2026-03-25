import { createSlice } from "@reduxjs/toolkit"

export const notesSlice = createSlice({
  name: "notes",
  initialState: {
    notes: []
  },
  reducers: {
    setNotes: (state, action) => {
      // Defensive: ensure we always store an array
      const payload = action.payload;
      state.notes = Array.isArray(payload) ? payload : [];
    }
  }
})

export const { setNotes } = notesSlice.actions
