const fs = require('fs').promises;
const path = require('path');

// Path to products.json
const PRODUCTS_PATH = path.join(__dirname, '../../public/data/products.json');

// Helper function to read products
const readProducts = async () => {
  try {
    const data = await fs.readFile(PRODUCTS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    throw new Error('Failed to read products data');
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await readProducts();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const products = await readProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await readProducts();
    const { category } = req.params;
    
    const filteredProducts = products.filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
    
    res.json({
      success: true,
      count: filteredProducts.length,
      data: filteredProducts
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const products = await readProducts();
    const { q, category, minPrice, maxPrice } = req.query;
    
    let filteredProducts = products;
    
    // Text search in title and description
    if (q) {
      const searchTerm = q.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by price range
    if (minPrice) {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= parseFloat(minPrice)
      );
    }
    
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product =>
        product.price <= parseFloat(maxPrice)
      );
    }
    
    res.json({
      success: true,
      count: filteredProducts.length,
      data: filteredProducts
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
};