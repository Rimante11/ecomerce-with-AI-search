const express = require('express');
const router = express.Router();

// Placeholder for future order functionality
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Orders endpoint - coming soon',
    data: []
  });
});

module.exports = router;