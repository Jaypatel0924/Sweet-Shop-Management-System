import User from '../models/User';

export const seedAdminUser = async () => {
  try {
    // Check if admin user already exists
    const adminCount = await User.countDocuments({ isAdmin: true });
    
    if (adminCount > 0) {
      console.log('✓ Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = new User({
      email: 'admin@sweetshop.com',
      username: 'admin',
      password: 'admin123456', // This will be hashed automatically
      isAdmin: true
    });

    await adminUser.save();
    console.log('✓ Admin user created successfully!');
    console.log('📧 Email: admin@sweetshop.com');
    console.log('🔐 Password: admin123456');
    console.log('💡 Change password after first login!');
    
  } catch (error) {
    console.error('✗ Error seeding admin user:', error);
  }
};

export const seedDemoUsers = async () => {
  try {
    // Check if demo users already exist
    const userCount = await User.countDocuments({ isAdmin: false });
    
    if (userCount > 0) {
      console.log('✓ Demo users already exist');
      return;
    }

    // Create demo customer users
    const demoUsers = [
      {
        email: 'customer@example.com',
        username: 'customer1',
        password: 'password123',
        isAdmin: false
      },
      {
        email: 'user@example.com',
        username: 'sweetheart',
        password: 'password123',
        isAdmin: false
      }
    ];

    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
    }

    console.log(`✓ Created ${demoUsers.length} demo users`);
    demoUsers.forEach(user => {
      console.log(`  📧 ${user.email} / 🔐 ${user.password}`);
    });
    
  } catch (error) {
    console.error('✗ Error seeding demo users:', error);
  }
};
