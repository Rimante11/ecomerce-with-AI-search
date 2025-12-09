// Consolidated API Handler for Vercel Deployment
// This single file handles all API routes to stay within Vercel's 12 function limit

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { getUsersCollection } from './lib/mongodb.js';
import bcrypt from 'bcrypt';

// Simple in-memory data (in production, this would connect to a database)
let products = null;

// users are persisted to disk in `data/users.json` when possible
const usersFileCandidates = [
  join(process.cwd(), 'data', 'users.json'),
  join(process.cwd(), 'api', 'users.json'),
  join(process.cwd(), 'public', 'data', 'users.json')
];

function findUsersFilePath() {
  for (const p of usersFileCandidates) {
    if (existsSync(p)) return p;
  }
  // default to first candidate (will be created if missing)
  return usersFileCandidates[0];
}

function loadUsersFromDisk() {
  try {
    const path = findUsersFilePath();
    if (existsSync(path)) {
      const raw = readFileSync(path, 'utf8');
      return JSON.parse(raw || '[]');
    }
  } catch (err) {
    console.error('Failed to load users from disk:', err);
  }
  return [];
}

function saveUsersToDisk(usersArray) {
  try {
    const path = findUsersFilePath();
    // Ensure directory exists
    const dir = dirname(path);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(path, JSON.stringify(usersArray, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to save users to disk:', err);
    return false;
  }
}

// Database-aware user operations with fallback to file system
const useDatabase = () => !!process.env.MONGODB_URI;

async function getUsers() {
  if (useDatabase()) {
    try {
      const collection = await getUsersCollection();
      return await collection.find({}).toArray();
    } catch (err) {
      console.error('Database error, falling back to file system:', err);
      return loadUsersFromDisk();
    }
  }
  return loadUsersFromDisk();
}

async function findUserByEmail(email) {
  if (useDatabase()) {
    try {
      const collection = await getUsersCollection();
      return await collection.findOne({ email });
    } catch (err) {
      console.error('Database error, falling back to file system:', err);
      const users = loadUsersFromDisk();
      return users.find(u => u.email === email);
    }
  }
  const users = loadUsersFromDisk();
  return users.find(u => u.email === email);
}

async function createUser(userData) {
  if (useDatabase()) {
    try {
      console.log('Using database to create user');
      const collection = await getUsersCollection();
      const result = await collection.insertOne({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { ...userData, _id: result.insertedId };
    } catch (err) {
      console.error('Database error, falling back to file system:', err);
      // Fallback to file system (will fail on Vercel)
      try {
        const users = loadUsersFromDisk();
        users.push(userData);
        const saved = saveUsersToDisk(users);
        if (!saved) {
          throw new Error('File system save failed - MONGODB_URI required for production');
        }
        return userData;
      } catch (fsErr) {
        console.error('File system fallback also failed:', fsErr);
        throw new Error('Cannot save user - MONGODB_URI environment variable required for production deployment');
      }
    }
  }
  // File system mode (local development only)
  console.log('Using file system to create user');
  const users = loadUsersFromDisk();
  users.push(userData);
  const saved = saveUsersToDisk(users);
  if (!saved) {
    throw new Error('Failed to save user to file system - check write permissions or set MONGODB_URI for production');
  }
  return userData;
}

async function updateUser(email, updates) {
  if (useDatabase()) {
    try {
      const collection = await getUsersCollection();
      const result = await collection.findOneAndUpdate(
        { email },
        { 
          $set: { 
            ...updates, 
            updatedAt: new Date() 
          } 
        },
        { returnDocument: 'after' }
      );
      return result;
    } catch (err) {
      console.error('Database error, falling back to file system:', err);
      // Fallback to file system
      const users = loadUsersFromDisk();
      const userIndex = users.findIndex(u => u.email === email);
      if (userIndex === -1) return null;
      users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() };
      saveUsersToDisk(users);
      return users[userIndex];
    }
  }
  // File system mode
  const users = loadUsersFromDisk();
  const userIndex = users.findIndex(u => u.email === email);
  if (userIndex === -1) return null;
  users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() };
  const saved = saveUsersToDisk(users);
  if (!saved) throw new Error('Failed to update user');
  return users[userIndex];
}


// Helper function to get products data
const getProducts = () => {
  if (!products) {
    try {
      // Try to load from api directory first (for Vercel serverless)
      const apiPath = join(process.cwd(), 'api', 'products.json');
      const publicPath = join(process.cwd(), 'public', 'data', 'products.json');
      
      let productsPath = apiPath;
      
      // Check which path exists
      if (existsSync(apiPath)) {
        productsPath = apiPath;
      } else if (existsSync(publicPath)) {
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

// Helper function to find user by email (reads from disk)
const findUser = (email) => {
  const usersArr = loadUsersFromDisk();
  return usersArr.find(user => user.email === email);
};

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
async function handleAuth(req, res, endpoint) {
  const [, action] = endpoint;

  switch (action) {
    case 'register':
      if (req.method === 'POST') {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
          return res.status(400).json({ message: 'All fields are required' });
        }

        try {
          console.log('Registration attempt for:', email);
          
          const existingUser = await findUserByEmail(email);
          if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
          }

          console.log('Creating new user:', email);
          const users = await getUsers();
          
          // Hash password before storing
          const hashedPassword = await bcrypt.hash(password, 12);
          
          const newUser = {
            id: users.length ? Math.max(...users.map(u => u.id || 0)) + 1 : 1,
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
          };

          await createUser(newUser);
          console.log('User created successfully:', email);

          const { password: _, ...userWithoutPassword } = newUser;
          return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userWithoutPassword
          });
        } catch (err) {
          console.error('Registration error:', err);
          console.error('Error stack:', err.stack);
          return res.status(500).json({ 
            message: 'Failed to register user',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Server error',
            hint: !process.env.MONGODB_URI ? 'MONGODB_URI not configured - database required for production' : undefined
          });
        }
      }
      break;
      
    case 'login':
      if (req.method === 'POST') {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({ message: 'Email and password are required' });
        }

        try {
          const user = await findUserByEmail(email);
          if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
          }
          
          // Compare hashed password
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
          }

          const { password: _, ...userWithoutPassword } = user;
          return res.json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword
          });
        } catch (err) {
          console.error('Login error:', err);
          return res.status(500).json({ message: 'Login failed' });
        }
      }
      break;
      
    case 'user':
      // GET /api/auth/user/:email  -> returns user
      // PUT /api/auth/user/:email  -> update user fields (name, password)
      {
        const [, , email] = endpoint;

        if (req.method === 'GET') {
          try {
            const user = await findUserByEmail(email);
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
            const { password: _, ...userWithoutPassword } = user;
            return res.json(userWithoutPassword);
          } catch (err) {
            console.error('Get user error:', err);
            return res.status(500).json({ message: 'Failed to fetch user' });
          }
        }

        if (req.method === 'PUT' || req.method === 'PATCH') {
          try {
            const { name, password: newPassword } = req.body;
            const updates = {};
            if (name) updates.name = name;
            if (newPassword) {
              // Hash new password before updating
              updates.password = await bcrypt.hash(newPassword, 12);
            }
            
            const updatedUser = await updateUser(email, updates);
            if (!updatedUser) {
              return res.status(404).json({ message: 'User not found' });
            }

            const { password: _, ...userWithoutPassword } = updatedUser;
            return res.json({ success: true, user: userWithoutPassword });
          } catch (err) {
            console.error('Update user error:', err);
            return res.status(500).json({ message: 'Failed to update user' });
          }
        }
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

// Main handler
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract endpoint from query parameters or URL path
  let endpoint = req.query.endpoint || [];
  
  // If endpoint is a string (Vercel format), split it into array
  if (typeof endpoint === 'string') {
    endpoint = endpoint.split('/').filter(Boolean);
  }
  
  // Fallback: parse from URL if endpoint is empty
  if (endpoint.length === 0 && req.url) {
    const urlPath = req.url.split('?')[0]; // Remove query string
    const match = urlPath.match(/^\/api\/(.+)$/);
    if (match) {
      endpoint = match[1].split('/').filter(Boolean);
    }
  }
  
  console.log('Endpoint:', endpoint, 'Method:', req.method, 'URL:', req.url);
  const [resource] = endpoint;

  // Route to appropriate handler
  switch (resource) {
    case 'products':
      return handleProducts(req, res, endpoint);
    case 'auth':
      return await handleAuth(req, res, endpoint);
    case 'orders':
      return handleOrders(req, res, endpoint);
    default:
      console.error('Unknown resource:', resource, 'Full endpoint:', endpoint);
      return res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        debug: {
          resource,
          endpoint,
          url: req.url,
          method: req.method
        },
        availableEndpoints: ['/api/products', '/api/auth', '/api/orders']
      });
  }
}