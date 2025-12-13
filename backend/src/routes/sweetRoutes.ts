import { Router } from 'express';
import SweetController from '../controllers/SweetController';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', (req, res) => SweetController.getAllSweets(req, res));
router.get('/search', (req, res) => SweetController.searchSweets(req, res));
router.get('/:id', (req, res) => SweetController.getSweetById(req, res));

// Protected routes
router.post(
  '/',
  authenticateToken,
  authorizeAdmin,
  (req, res) => SweetController.createSweet(req, res)
);

router.put(
  '/:id',
  authenticateToken,
  authorizeAdmin,
  (req, res) => SweetController.updateSweet(req, res)
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeAdmin,
  (req, res) => SweetController.deleteSweet(req, res)
);

// Purchase endpoint
router.post(
  '/:id/purchase',
  authenticateToken,
  (req, res) => SweetController.purchaseSweet(req, res)
);

// Restock endpoint
router.post(
  '/:id/restock',
  authenticateToken,
  authorizeAdmin,
  (req, res) => SweetController.restockSweet(req, res)
);

export default router;
