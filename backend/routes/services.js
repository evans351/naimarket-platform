const express = require('express');
const router = express.Router();
const db = require('../db');

// Get total number of services
router.get('/count', (req, res) => {
  db.query('SELECT COUNT(*) AS totalServices FROM services', (err, results) => {
    if (err) {
      console.error('Error fetching service count:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results[0]);
  });
});

module.exports = router;
