import { createSlice } from "@reduxjs/toolkit";

export const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    quiz: []
  },
  reducers: {
    setQuiz: (state, action) => {
      state.quiz = action.payload
    }
  }
})

export const { setQuiz } = quizSlice.actions;