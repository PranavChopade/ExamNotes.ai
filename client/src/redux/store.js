import { configureStore } from "@reduxjs/toolkit"
import { userSlice } from "./userSlice"
import { notesSlice } from "./notesSlice"
import { quizSlice } from "./quizSlice"
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    notes: notesSlice.reducer,
    quiz: quizSlice.reducer
  }
})
export default store