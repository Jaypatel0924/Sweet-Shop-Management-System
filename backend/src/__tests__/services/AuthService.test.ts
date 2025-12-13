import { AuthService } from '../../services/AuthService';
import User from '../../models/User';
import mongoose from 'mongoose';

// Mock mongoose and User model
jest.mock('../../models/User');

describe('AuthService', () => {
  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword123',
    isAdmin: false,
    comparePassword: jest.fn(),
    save: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User as any).mockImplementation(() => ({
        ...mockUser,
        save: jest.fn().mockResolvedValue(mockUser)
      }));

      const result = await AuthService.register('newuser@test.com', 'newuser', 'password123');

      expect(result).toBeDefined();
      expect(result.email).toBe('newuser@test.com');
    });

    it('should throw error if user already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        AuthService.register('test@example.com', 'testuser', 'password123')
      ).rejects.toThrow('User with this email or username already exists');
    });

    it('should throw error if email already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });

      await expect(
        AuthService.register('test@example.com', 'newusername', 'password123')
      ).rejects.toThrow('User with this email or username already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully with correct password', async () => {
      const mockUserWithPassword = {
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserWithPassword)
      });

      const result = await AuthService.login('test@example.com', 'password123');

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
    });

    it('should throw error if user not found', async () => {
      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await expect(
        AuthService.login('nonexistent@test.com', 'password123')
      ).rejects.toThrow('User not found');
    });

    it('should throw error if password is invalid', async () => {
      const mockUserWithPassword = {
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserWithPassword)
      });

      await expect(
        AuthService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid password');
    });
  });

  describe('getUserById', () => {
    it('should get user by ID', async () => {
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.getUserById(mockUser._id.toString());

      expect(result).toBeDefined();
      expect(result?.email).toBe('test@example.com');
    });

    it('should return null if user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const result = await AuthService.getUserById('nonexistentid');

      expect(result).toBeNull();
    });
  });
});
