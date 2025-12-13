import Sweet, { ISweet } from '../models/Sweet';

export class SweetService {
  // Create a new sweet
  async createSweet(sweetData: Partial<ISweet>): Promise<ISweet> {
    const sweet = new Sweet(sweetData);
    await sweet.save();
    return sweet;
  }

  // Get all sweets
  async getAllSweets(): Promise<ISweet[]> {
    return Sweet.find().sort({ createdAt: -1 });
  }

  // Get sweet by ID
  async getSweetById(id: string): Promise<ISweet | null> {
    return Sweet.findById(id);
  }

  // Search sweets by name, category, or price range
  async searchSweets(
    name?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number
  ): Promise<ISweet[]> {
    const query: any = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    return Sweet.find(query).sort({ createdAt: -1 });
  }

  // Update a sweet
  async updateSweet(id: string, updateData: Partial<ISweet>): Promise<ISweet | null> {
    return Sweet.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  // Delete a sweet
  async deleteSweet(id: string): Promise<ISweet | null> {
    return Sweet.findByIdAndDelete(id);
  }

  // Purchase a sweet (decrease quantity)
  async purchaseSweet(id: string, quantity: number): Promise<ISweet | null> {
    const sweet = await Sweet.findById(id);

    if (!sweet) {
      throw new Error('Sweet not found');
    }

    if (sweet.quantity < quantity) {
      throw new Error('Insufficient quantity in stock');
    }

    sweet.quantity -= quantity;
    await sweet.save();
    return sweet;
  }

  // Restock a sweet (increase quantity)
  async restockSweet(id: string, quantity: number): Promise<ISweet | null> {
    const sweet = await Sweet.findById(id);

    if (!sweet) {
      throw new Error('Sweet not found');
    }

    sweet.quantity += quantity;
    await sweet.save();
    return sweet;
  }
}

export default new SweetService();
