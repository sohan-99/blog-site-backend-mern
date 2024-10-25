import express from "express";
import { registerUser } from "../controllers/userControllers.js"; // Ensure the path is correct
const router = express.Router();

router.post("/register", registerUser);

export default router;
