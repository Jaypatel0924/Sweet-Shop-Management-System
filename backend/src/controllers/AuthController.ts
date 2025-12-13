import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import AuthService from '../services/AuthService';
import { generateToken } from '../utils/jwt';

export class AuthController {
  // Register handler
  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, username, password, confirmPassword } = req.body;

      // Validate input
      if (!email || !username || !password || !confirmPassword) {
        res.status(400).json({ message: 'All fields are required' });
        return;
      }

      if (password !== confirmPassword) {
        res.status(400).json({ message: 'Passwords do not match' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters' });
        return;
      }

      const user = await AuthService.register(email, username, password);
      const token = generateToken(user._id.toString(), user.isAdmin);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json({ message });
    }
  }

  // Login handler
  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }

      const user = await AuthService.login(email, password);
      const token = generateToken(user._id.toString(), user.isAdmin);

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      res.status(401).json({ message });
    }
  }

  // Get current user
  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await AuthService.getUserById(req.user.userId);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user';
      res.status(500).json({ message });
    }
  }
}

export default new AuthController();
