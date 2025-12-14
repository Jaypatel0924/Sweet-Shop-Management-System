import express from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

// Create order
router.post('/', OrderController.createOrder);

// Verify payment
router.post('/verify-payment', OrderController.verifyPayment);

// Get all orders (Admin/Delivery Manager)
router.get('/', OrderController.getAllOrders);

// Get user orders
router.get('/my-orders', OrderController.getUserOrders);

// Get order by ID
router.get('/:orderId', OrderController.getOrderById);

// Update order status (admin only)
router.put('/:orderId/status', OrderController.updateOrderStatus);

// Cancel order
router.post('/:orderId/cancel', OrderController.cancelOrder);

export default router;
