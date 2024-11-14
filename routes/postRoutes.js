import express from "express";
const router = express.Router();
import { createPost, updatePost, getPost, deletePost, getAllPosts } from "../controllers/postControllers.js"; 
import { authGuard, adminGuard } from "../middleware/authMiddleware.js";
// create post routes
// router.post("/", authGuard, adminGuard, createPost);
router.route("/").post(authGuard, adminGuard, createPost).get(getAllPosts);
// update post routes
router.put("/:slug", authGuard, adminGuard, updatePost);
// delete post routes
router.delete("/:slug", authGuard, adminGuard, deletePost);
// get all routes
router.get("/:slug", getPost);

export default router;