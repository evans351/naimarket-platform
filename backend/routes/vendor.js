const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/vendors - fetch all vendors from MySQL
router.get('/', (req, res) => {
  const query = 'SELECT id, name, description, image, category FROM vendors';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Failed to fetch vendors:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;

