import express from "express";
const router = express.Router();
import { createPost, updatePost, deletePost } from "../controllers/postControllers.js"; // Ensure .js extension is added here
import { authGuard, adminGuard } from "../middleware/authMiddleware.js";

router.post("/", authGuard, adminGuard, createPost);
router.put("/:slug", authGuard, adminGuard, updatePost);
router.delete("/:slug",authGuard, adminGuard, deletePost);
export default router;
