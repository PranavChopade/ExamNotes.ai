import { configureStore } from "@reduxjs/toolkit"
import { userSlice } from "./userSlice"
import { notesSlice } from "./notesSlice"
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    notes: notesSlice.reducer
  }
})
export default store