import express from 'express';
import { createPost, getPosts, getEvents, hostEvent, addComment, toggleReaction, upload,deletePost } from '../controller/communityController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Posts
router.post('/posts', authMiddleware, upload.single('image'), createPost);
router.get('/posts', getPosts);

// Events
router.post('/events', authMiddleware, hostEvent);
router.get('/events', getEvents);

// Comments
router.post('/posts/:postId/comments', authMiddleware, addComment);

// Reactions
router.post('/posts/:postId/react', authMiddleware, toggleReaction);

// DELETE POST
router.delete('/posts/:postId', authMiddleware, deletePost);


export default router;
