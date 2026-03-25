import dotenv from "dotenv"
dotenv.config();
import app from "./src/app.js"
import { ConnectDB } from "./src/config/db.js";
import { ENV } from "./src/config/ENV.js";

const PORT = ENV.PORT || 3000;

const startServer = async () => {
  try {
    await ConnectDB();
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
