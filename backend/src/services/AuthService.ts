import User, { IUser } from '../models/User';

export class AuthService {
  // Register a new user
  async register(email: string, username: string, password: string): Promise<IUser> {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const user = new User({
      email,
      username,
      password,
      isAdmin: false
    });

    await user.save();
    return user;
  }

  // Login user
  async login(email: string, password: string): Promise<IUser> {
    // Handle admin prefix (for admin-only verification if needed)
    let loginEmail = email;
    if (email.startsWith('admin_')) {
      loginEmail = email.substring(6); // Remove 'admin_' prefix
    }

    const user = await User.findOne({ email: loginEmail }).select('+password');

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return user;
  }

  // Get user by ID
  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  }
}

export default new AuthService();
