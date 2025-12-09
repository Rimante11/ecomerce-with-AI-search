// MongoDB connection utility for serverless functions
// Maintains a connection pool to avoid cold start issues

import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI not set - database features will be disabled');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve value across module reloads
  if (!global._mongoClientPromise) {
    if (uri) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client
  if (uri) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;

// Helper function to get database instance
export async function getDatabase() {
  if (!clientPromise) {
    throw new Error('MongoDB connection not configured. Please set MONGODB_URI environment variable.');
  }
  const client = await clientPromise;
  return client.db('ecommerce'); // Your database name
}

// Helper function to get users collection
export async function getUsersCollection() {
  const db = await getDatabase();
  return db.collection('users');
}
