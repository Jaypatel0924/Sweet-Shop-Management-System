import { SweetService } from '../../services/SweetService';
import Sweet from '../../models/Sweet';
import mongoose from 'mongoose';

jest.mock('../../models/Sweet');

describe('SweetService', () => {
  const mockSweet = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Chocolate Cake',
    category: 'Cake',
    price: 50,
    quantity: 10,
    description: 'Delicious chocolate cake',
    image: 'image.jpg',
    save: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSweet', () => {
    it('should create a new sweet successfully', async () => {
      (Sweet as any).mockImplementation(() => ({
        ...mockSweet,
        save: jest.fn().mockResolvedValue(mockSweet)
      }));

      const result = await SweetService.createSweet({
        name: 'Chocolate Cake',
        category: 'Cake',
        price: 50,
        quantity: 10
      });

      expect(result).toBeDefined();
      expect(result.name).toBe('Chocolate Cake');
    });
  });

  describe('getAllSweets', () => {
    it('should get all sweets', async () => {
      const mockSweets = [mockSweet, { ...mockSweet, name: 'Vanilla Cake' }];
      (Sweet.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockSweets)
      });

      const result = await SweetService.getAllSweets();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Chocolate Cake');
    });
  });

  describe('getSweetById', () => {
    it('should get sweet by ID', async () => {
      (Sweet.findById as jest.Mock).mockResolvedValue(mockSweet);

      const result = await SweetService.getSweetById(mockSweet._id.toString());

      expect(result).toBeDefined();
      expect(result?.name).toBe('Chocolate Cake');
    });

    it('should return null if sweet not found', async () => {
      (Sweet.findById as jest.Mock).mockResolvedValue(null);

      const result = await SweetService.getSweetById('nonexistentid');

      expect(result).toBeNull();
    });
  });

  describe('searchSweets', () => {
    it('should search sweets by name', async () => {
      (Sweet.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue([mockSweet])
      });

      const result = await SweetService.searchSweets('Chocolate');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Chocolate Cake');
    });

    it('should search sweets by category', async () => {
      (Sweet.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue([mockSweet])
      });

      const result = await SweetService.searchSweets(undefined, 'Cake');

      expect(result).toHaveLength(1);
    });

    it('should search sweets by price range', async () => {
      (Sweet.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue([mockSweet])
      });

      const result = await SweetService.searchSweets(undefined, undefined, 40, 60);

      expect(result).toHaveLength(1);
    });
  });

  describe('purchaseSweet', () => {
    it('should purchase sweet successfully', async () => {
      const mockSweetWithSave = {
        ...mockSweet,
        quantity: 10,
        save: jest.fn().mockResolvedValue(mockSweet)
      };

      (Sweet.findById as jest.Mock).mockResolvedValue(mockSweetWithSave);

      const result = await SweetService.purchaseSweet(mockSweet._id.toString(), 2);

      expect(result).toBeDefined();
      expect(mockSweetWithSave.quantity).toBe(8);
    });

    it('should throw error if sweet not found', async () => {
      (Sweet.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        SweetService.purchaseSweet('nonexistentid', 1)
      ).rejects.toThrow('Sweet not found');
    });

    it('should throw error if insufficient quantity', async () => {
      const mockSweetLowStock = {
        ...mockSweet,
        quantity: 1
      };

      (Sweet.findById as jest.Mock).mockResolvedValue(mockSweetLowStock);

      await expect(
        SweetService.purchaseSweet(mockSweet._id.toString(), 5)
      ).rejects.toThrow('Insufficient quantity in stock');
    });
  });

  describe('restockSweet', () => {
    it('should restock sweet successfully', async () => {
      const mockSweetWithSave = {
        ...mockSweet,
        quantity: 10,
        save: jest.fn().mockResolvedValue(mockSweet)
      };

      (Sweet.findById as jest.Mock).mockResolvedValue(mockSweetWithSave);

      const result = await SweetService.restockSweet(mockSweet._id.toString(), 5);

      expect(result).toBeDefined();
      expect(mockSweetWithSave.quantity).toBe(15);
    });

    it('should throw error if sweet not found', async () => {
      (Sweet.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        SweetService.restockSweet('nonexistentid', 5)
      ).rejects.toThrow('Sweet not found');
    });
  });
});
