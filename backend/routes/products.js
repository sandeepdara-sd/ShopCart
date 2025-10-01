import express from 'express';
import productsData from '../data/products.json' with { type: 'json' };

const router = express.Router();

// 1️⃣ Get all products
router.get('/', (req, res) => res.json(productsData));

// 2️⃣ Get all categories (static route before dynamic ones)
router.get('/categories/all', (req, res) => {
  const categories = [...new Set(productsData.map(p => p.category))];
  res.json(categories);
});

// 3️⃣ Get products by category
router.get('/category/:category', (req, res) => {
  const filtered = productsData.filter(p => p.category === req.params.category);
  res.json(filtered);
});

// 4️⃣ Get product by ID (dynamic route last)
router.get('/:id', (req, res) => {
  const product = productsData.find(p => p.id === parseInt(req.params.id));
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
});

export default router;