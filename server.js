import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
// Routes
import userRoutes from './routes/userRoutes.js';
import {
  errorResponserHandler,
  invalidPathHandler,
} from './middleware/errorHandler.js'
dotenv.config();
connectDB();
import cors from 'cors';
const app = express();
export const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition'],
};

// Apply CORS first
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running...");
});
app.use("/api/users", userRoutes);
app.use(invalidPathHandler);
app.use(errorResponserHandler);




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
