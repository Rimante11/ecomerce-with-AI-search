// Local development server for testing API routes
// In production, these are handled by Vercel serverless functions

import express from 'express';
import cors from 'cors';
import apiHandler from './[...endpoint].js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route all /api/* requests to the serverless handler
app.all('/api/*', (req, res) => {
  // Extract endpoint parts from the URL
  const path = req.path.replace('/api/', '');
  // Decode URL components to handle encoded characters like %40 for @
  const parts = path.split('/').map(part => decodeURIComponent(part));
  
  // Create mock Vercel query object
  req.query = {
    ...req.query,
    endpoint: parts
  };
  
  // Call the serverless handler
  if (typeof apiHandler === 'function') {
    apiHandler(req, res);
  } else if (apiHandler.default && typeof apiHandler.default === 'function') {
    apiHandler.default(req, res);
  } else {
    res.status(500).json({ error: 'API handler not properly configured' });
  }
});

// Health check and root route
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API server is running',
    endpoints: {
      health: '/health',
      api: '/api/*'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/*`);
});
