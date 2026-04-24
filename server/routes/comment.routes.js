import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import { addComment, getBlogComments, getReplies, deleteComment } from '../controllers/comment.controller.js';

const router = Router();

// Public
router.post("/get-blog-comments", getBlogComments);
router.post("/get-replies", getReplies);

// Protected
router.post("/add-comment", verifyJWT, addComment);
router.post("/delete-comment", verifyJWT, deleteComment);

export default router;
