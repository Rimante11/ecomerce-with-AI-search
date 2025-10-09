const express = require('express');
const { registerUser, loginUser, getUserDetails } = require('../controllers/authController');

const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Get user details route
router.get('/user/:email', getUserDetails);

module.exports = router;