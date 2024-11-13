import express from "express";
const router = express.Router();
import { createPost, updatePost, getPost, deletePost } from "../controllers/postControllers.js"; 
import { authGuard, adminGuard } from "../middleware/authMiddleware.js";

router.post("/", authGuard, adminGuard, createPost);
router.put("/:slug", authGuard, adminGuard, updatePost);
router.delete("/:slug", authGuard, adminGuard, deletePost);

router.get("/:slug", getPost);

export default router;