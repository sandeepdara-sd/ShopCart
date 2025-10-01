import express from 'express';
import Cart from '../models/Cart.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, title, price, image, quantity = 1 } = req.body;
    
    if (!productId || !title || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    // Convert productId to string for comparison
    const productIdStr = String(productId);
    const existingItemIndex = cart.items.findIndex(
      item => String(item.productId) === productIdStr
    );
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId: productIdStr, title, price, image, quantity });
    }

    // Calculate totals
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Error adding item to cart', error: error.message });
  }
});

// Update item quantity
router.put('/update/:productId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIdStr = String(req.params.productId);
    const itemIndex = cart.items.findIndex(
      item => String(item.productId) === productIdStr
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    // Calculate totals
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item', error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIdStr = String(req.params.productId);
    cart.items = cart.items.filter(
      item => String(item.productId) !== productIdStr
    );
    
    // Calculate totals
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing cart item', error: error.message });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalPrice = 0;
    cart.totalItems = 0;
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
});

export default router;