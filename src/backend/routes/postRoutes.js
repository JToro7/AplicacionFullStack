import express from 'express';
import { getPosts, createPost, updatePost, deletePost } from '../controllers/postController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getPosts);

// Rutas protegidas
router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);

export default router;