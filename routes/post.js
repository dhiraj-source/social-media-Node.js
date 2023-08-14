import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/post.js "

const router = express.Router()


// READ
router.get('/', authMiddleware, getFeedPosts)

router.post('/:userId/posts', authMiddleware, getUserPosts)

router.get('/:id/like', authMiddleware, likePost)




export default router;