import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; // to resolve __dirname in ES module
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { errorResponserHandler, invalidPathHandler } from "./middleware/errorHandler.js";
import cors from "cors";

// Set up dotenv and database connection
dotenv.config();
connectDB();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
export const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Disposition"],
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/users", userRoutes);

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Error handling middleware
app.use(invalidPathHandler);
app.use(errorResponserHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
