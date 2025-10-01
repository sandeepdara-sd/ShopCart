import express from 'express';
import auth from '../middleware/auth.js';
import Wishlist from '../models/Wishlist.js';

const router = express.Router();

// Get wishlist
router.get('/', auth, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
});

// Add item
router.post('/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const item = req.body; // expects: { title, image, price, category, rating }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, items: [] });

    if (wishlist.items.some((p) => p.productId === productId)) {
      return res.status(200).json(wishlist);
    }

    wishlist.items.push({ productId, ...item });
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
});

// Remove item
router.delete('/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(200).json({ items: [] });
    wishlist.items = wishlist.items.filter((p) => p.productId !== productId);
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove from wishlist' });
  }
});

// Clear
router.delete('/', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(200).json({ items: [] });
    wishlist.items = [];
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear wishlist' });
  }
});

export default router;


