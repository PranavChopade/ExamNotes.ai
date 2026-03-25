import mongoose from "mongoose";
import { ENV } from "./ENV.js";

export const ConnectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("connected to the database")
    })
    mongoose.connection.on("disconnected", () => {
      console.log("database disconnected")
    })
    mongoose.connection.on("error", (error) => {
      console.log("database error", error)
    })
    await mongoose.connect(ENV.MONGO_URI, {
      dbName: "aiNotesGen"
    })
  } catch (error) {
    console.log(error)
  }
}