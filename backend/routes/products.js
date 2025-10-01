import express from 'express';
import productsData from '../data/products.json' assert { type: 'json' }; // Node.js 18+ supports this

const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  res.json(productsData);
});

// Get product by ID
router.get('/:id', (req, res) => {
  const product = productsData.find(p => p.id === parseInt(req.params.id));
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
});

// Get products by category
router.get('/category/:category', (req, res) => {
  const filtered = productsData.filter(p => p.category === req.params.category);
  res.json(filtered);
});

// Get all categories
router.get('/categories/all', (req, res) => {
  const categories = [...new Set(productsData.map(p => p.category))];
  res.json(categories);
});

export default router;
