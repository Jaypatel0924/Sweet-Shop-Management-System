import mongoose from 'mongoose';
import Sweet from '../models/Sweet';

const initialSweets = [
  {
    name: 'Chocolate Truffle',
    category: 'Chocolate',
    price: 2.99,
    quantity: 50,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
  },
  {
    name: 'Strawberry Cheesecake',
    category: 'Dessert',
    price: 4.99,
    quantity: 30,
    image: 'https://images.unsplash.com/photo-1533134242443-742ce9801d0c?w=400&h=300&fit=crop'
  },
  {
    name: 'Vanilla Macarons',
    category: 'Pastry',
    price: 3.49,
    quantity: 45,
    image: 'https://images.unsplash.com/photo-1569718150521-bc8022ba831d?w=400&h=300&fit=crop'
  },
  {
    name: 'Caramel Popcorn',
    category: 'Candy',
    price: 2.49,
    quantity: 60,
    image: 'https://images.unsplash.com/photo-1555024976-91f09fbc0852?w=400&h=300&fit=crop'
  },
  {
    name: 'Dark Chocolate Bark',
    category: 'Chocolate',
    price: 3.99,
    quantity: 40,
    image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd26f1e?w=400&h=300&fit=crop'
  },
  {
    name: 'Fruit Gummies',
    category: 'Candy',
    price: 1.99,
    quantity: 100,
    image: 'https://images.unsplash.com/photo-1599599810820-f283b7c0d0e2?w=400&h=300&fit=crop'
  },
  {
    name: 'Lemon Tart',
    category: 'Pastry',
    price: 3.99,
    quantity: 25,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
  },
  {
    name: 'Cinnamon Donuts',
    category: 'Dessert',
    price: 1.49,
    quantity: 80,
    image: 'https://images.unsplash.com/photo-1595521624481-40741a3bed39?w=400&h=300&fit=crop'
  },
  {
    name: 'Mint Chocolate Chip',
    category: 'Chocolate',
    price: 4.49,
    quantity: 35,
    image: 'https://images.unsplash.com/photo-1599599810232-c0e2e3c3f1f0?w=400&h=300&fit=crop'
  },
  {
    name: 'Rainbow Lollipops',
    category: 'Candy',
    price: 0.99,
    quantity: 150,
    image: 'https://images.unsplash.com/photo-1599599810356-ba6a38dc2e43?w=400&h=300&fit=crop'
  }
];

export const seedInitialSweets = async () => {
  try {
    // Check if sweets already exist
    const count = await Sweet.countDocuments();
    
    if (count === 0) {
      console.log('Seeding initial sweets...');
      await Sweet.insertMany(initialSweets);
      console.log('✅ Initial sweets seeded successfully');
    } else {
      console.log('✓ Sweets already exist in database, skipping seed');
    }
  } catch (error) {
    console.error('Failed to seed sweets:', error);
  }
};
