import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import SweetService from '../services/SweetService';

export class SweetController {
  // Create a new sweet (Admin only)
  async createSweet(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, category, price, quantity, description, image } = req.body;

      // Validate required fields
      if (!name || !category || price === undefined || quantity === undefined) {
        res.status(400).json({ 
          message: 'Name, category, price, and quantity are required' 
        });
        return;
      }

      const sweet = await SweetService.createSweet({
        name,
        category,
        price,
        quantity,
        description,
        image
      });

      res.status(201).json({
        message: 'Sweet created successfully',
        sweet
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create sweet';
      res.status(400).json({ message });
    }
  }

  // Get all sweets
  async getAllSweets(req: AuthRequest, res: Response): Promise<void> {
    try {
      const sweets = await SweetService.getAllSweets();
      res.status(200).json({
        count: sweets.length,
        sweets
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch sweets';
      res.status(500).json({ message });
    }
  }

  // Get sweet by ID
  async getSweetById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const sweet = await SweetService.getSweetById(id);

      if (!sweet) {
        res.status(404).json({ message: 'Sweet not found' });
        return;
      }

      res.status(200).json({ sweet });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch sweet';
      res.status(500).json({ message });
    }
  }

  // Search sweets
  async searchSweets(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, category, minPrice, maxPrice } = req.query;

      const sweets = await SweetService.searchSweets(
        name as string | undefined,
        category as string | undefined,
        minPrice ? Number(minPrice) : undefined,
        maxPrice ? Number(maxPrice) : undefined
      );

      res.status(200).json({
        count: sweets.length,
        sweets
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Search failed';
      res.status(500).json({ message });
    }
  }

  // Update a sweet (Admin only)
  async updateSweet(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validate that at least one field is being updated
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ message: 'No update data provided' });
        return;
      }

      const sweet = await SweetService.updateSweet(id, updateData);

      if (!sweet) {
        res.status(404).json({ message: 'Sweet not found' });
        return;
      }

      res.status(200).json({
        message: 'Sweet updated successfully',
        sweet
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update sweet';
      res.status(400).json({ message });
    }
  }

  // Delete a sweet (Admin only)
  async deleteSweet(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const sweet = await SweetService.deleteSweet(id);

      if (!sweet) {
        res.status(404).json({ message: 'Sweet not found' });
        return;
      }

      res.status(200).json({
        message: 'Sweet deleted successfully',
        sweet
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete sweet';
      res.status(500).json({ message });
    }
  }

  // Purchase a sweet
  async purchaseSweet(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        res.status(400).json({ message: 'Valid quantity is required' });
        return;
      }

      const sweet = await SweetService.purchaseSweet(id, quantity);

      res.status(200).json({
        message: 'Purchase successful',
        sweet
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Purchase failed';
      res.status(400).json({ message });
    }
  }

  // Restock a sweet (Admin only)
  async restockSweet(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        res.status(400).json({ message: 'Valid quantity is required' });
        return;
      }

      const sweet = await SweetService.restockSweet(id, quantity);

      res.status(200).json({
        message: 'Restock successful',
        sweet
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Restock failed';
      res.status(400).json({ message });
    }
  }
}

export default new SweetController();
