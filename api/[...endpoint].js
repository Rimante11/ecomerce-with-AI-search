// Consolidated API Handler for Vercel Deployment
// This single file handles all API routes to stay within Vercel's 12 function limit

import { readFileSync } from 'fs';
import { join } from 'path';

// Simple in-memory data (in production, this would connect to a database)
let products = null;
let users = [];

// Helper function to get products data
const getProducts = () => {
  if (!products) {
    try {
      // Try to load from api directory first (for Vercel serverless)
      const apiPath = join(process.cwd(), 'api', 'products.json');
      const publicPath = join(process.cwd(), 'public', 'data', 'products.json');
      
      let productsPath = apiPath;
      
      // Check which path exists
      if (require('fs').existsSync(apiPath)) {
        productsPath = apiPath;
      } else if (require('fs').existsSync(publicPath)) {
        productsPath = publicPath;
      }
      
      console.log('Loading products from:', productsPath);
      products = JSON.parse(readFileSync(productsPath, 'utf8'));
      console.log('Products loaded successfully, count:', products.length);
    } catch (error) {
      console.error('Error loading products:', error);
      console.error('Current working directory:', process.cwd());
      // Return fallback data if file loading fails
      products = [
        {
          id: 1,
          title: "Sample Product",
          price: 29.99,
          description: "This is a sample product while we load the full catalog.",
          category: "men's clothing",
          image: "/assets/images/placeholder.png",
          rating: { rate: 4.5, count: 100 }
        }
      ];
    }
  }
  return products;
};

// Helper function to find user by email
const findUser = (email) => {
  return users.find(user => user.email === email);
};

// Main API handler
export default function handler(req, res) {
  const { method, query } = req;
  const { endpoint } = query;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Route handling based on endpoint parameter
    switch (endpoint[0]) {
      // PRODUCT ROUTES
      case 'products':
        return handleProducts(req, res, query.endpoint);
      
      // USER/AUTH ROUTES  
      case 'auth':
        return handleAuth(req, res, query.endpoint);
        
      // ORDER ROUTES
      case 'orders':
        return handleOrders(req, res, query.endpoint);
        
      default:
        return res.status(404).json({ message: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
}

// Product handlers
function handleProducts(req, res, endpoint) {
  const [, action, id] = endpoint;

  switch (req.method) {
    case 'GET':
      if (id) {
        // Get single product
        const products = getProducts();
        const product = products.find(p => p.id === parseInt(id));
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        return res.json({ success: true, data: product });
      } else {
        // Get all products or filter by category
        const products = getProducts();
        const { category, search } = req.query;
        
        let filteredProducts = products;
        
        if (category) {
          filteredProducts = products.filter(p => 
            p.category.toLowerCase() === category.toLowerCase()
          );
        }
        
        if (search) {
          filteredProducts = filteredProducts.filter(p =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        return res.json({ 
          success: true, 
          count: filteredProducts.length,
          data: filteredProducts 
        });
      }
      
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Authentication handlers
function handleAuth(req, res, endpoint) {
  const [, action] = endpoint;

  switch (action) {
    case 'register':
      if (req.method === 'POST') {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
          return res.status(400).json({ message: 'All fields are required' });
        }
        
        if (findUser(email)) {
          return res.status(400).json({ message: 'User already exists' });
        }
        
        const newUser = {
          id: users.length + 1,
          name,
          email,
          password, // In production, this should be hashed
          createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        
        const { password: _, ...userWithoutPassword } = newUser;
        return res.status(201).json({
          success: true,
          message: 'User registered successfully',
          user: userWithoutPassword
        });
      }
      break;
      
    case 'login':
      if (req.method === 'POST') {
        const { email, password } = req.body;
        
        if (!email || !password) {
          return res.status(400).json({ message: 'Email and password are required' });
        }
        
        const user = findUser(email);
        if (!user || user.password !== password) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const { password: _, ...userWithoutPassword } = user;
        return res.json({
          success: true,
          message: 'Login successful',
          user: userWithoutPassword
        });
      }
      break;
      
    case 'user':
      if (req.method === 'GET') {
        const [, , email] = endpoint;
        const user = findUser(email);
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        const { password: _, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      }
      break;
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

// Order handlers
function handleOrders(req, res, endpoint) {
  const [, action] = endpoint;
  
  switch (req.method) {
    case 'GET':
      return res.json({
        success: true,
        message: 'Orders endpoint - coming soon',
        data: []
      });
      
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}