import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import notesRouter from "./routes/notes.routes.js";
import { ENV } from "./config/ENV.js";
// CORS configuration
app.use(
  cors({
    origin: ENV.ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse cookies for authentication
app.use(cookieParser());

// Route handlers
app.use("/api/auth/v1", authRouter);
app.use("/api/notes/v1", notesRouter);

export default app;
