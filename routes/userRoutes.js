import express from "express";
import { loginUser, registerUser, userProfile } from "../controllers/userControllers.js"; 
import { authGuard } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile",authGuard, userProfile);
export default router;
