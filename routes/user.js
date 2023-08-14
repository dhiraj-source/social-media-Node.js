import express from "express";
import authMiddleware from "../middleware/auth.js"
import { getUser, getUserFriends, addRemoveFriends } from "../controllers/user.js"
const router = express.Router()

//READ

router.get('/:id', authMiddleware, getUser)
router.get('/:id/friends', authMiddleware, getUserFriends)

//UPDATE
router.patch('/:id/:friendsId/addRemoveFriends', authMiddleware, addRemoveFriends)


export default router;

