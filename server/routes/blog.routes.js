import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import {
    latestBlogs,
    allLatestBlogsCount,
    trendingBlogs,
    searchBlogs,
    searchBlogsCount,
    createBlog,
    getBlog,
    likeBlog,
    isLikedByUser,
    userWrittenBlogs,
    userWrittenBlogsCount,
    deleteBlog
} from '../controllers/blog.controller.js';

const router = Router();

// Public
router.post("/latest-blogs", latestBlogs);
router.post("/all-latest-blogs-count", allLatestBlogsCount);
router.get("/trending-blogs", trendingBlogs);
router.post("/search-blogs", searchBlogs);
router.post("/search-blogs-count", searchBlogsCount);
router.post("/get-blog", getBlog);

// Protected
router.post("/create-blog", verifyJWT, createBlog);
router.post("/like-blog", verifyJWT, likeBlog);
router.post("/isliked-by-user", verifyJWT, isLikedByUser);
router.post("/user-written-blogs", verifyJWT, userWrittenBlogs);
router.post("/user-written-blogs-count", verifyJWT, userWrittenBlogsCount);
router.post("/delete-blog", verifyJWT, deleteBlog);

export default router;
