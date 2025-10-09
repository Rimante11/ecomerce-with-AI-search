const express = require('express');
const { 
  getAllProducts, 
  getProductById, 
  getProductsByCategory,
  searchProducts 
} = require('../controllers/productController');

const router = express.Router();

// Get all products
router.get('/', getAllProducts);

// Search products
router.get('/search', searchProducts);

// Get products by category
router.get('/category/:category', getProductsByCategory);

// Get single product by ID
router.get('/:id', getProductById);

module.exports = router;