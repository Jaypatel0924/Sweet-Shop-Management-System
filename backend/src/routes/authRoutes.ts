import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', (req, res) => AuthController.register(req, res));
router.post('/login', (req, res) => AuthController.login(req, res));

// Protected routes
router.get('/me', authenticateToken, (req, res) => AuthController.getCurrentUser(req, res));

export default router;
