import express from 'express';
import axios from 'axios';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`https://fakestoreapi.com/products/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const response = await axios.get(`https://fakestoreapi.com/products/category/${req.params.category}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by category', error: error.message });
  }
});

// Get all categories
router.get('/categories/all', async (req, res) => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products/categories');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

export default router;