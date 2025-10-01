import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/create', auth, async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderNumber = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    const order = new Order({
      userId: req.user._id,
      orderNumber,
      items: cart.items,
      totalPrice: cart.totalPrice,
      shippingAddress
    });

    await order.save();
    
    // Clear cart after order
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

export default router;