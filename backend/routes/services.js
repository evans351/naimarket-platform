const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Route: Get total number of services
router.get('/count', (req, res) => {
  db.query('SELECT COUNT(*) AS totalServices FROM services', (err, results) => {
    if (err) {
      console.error('Error fetching service count:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results[0]);
  });
});

// ✅ Route: Get all services, or filter by vendor_id
router.get('/', (req, res) => {
  const vendorId = req.query.vendor_id;

  let sql = 'SELECT * FROM services';
  let params = [];

  if (vendorId) {
    sql += ' WHERE vendor_id = ?';
    params.push(vendorId);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('❌ Error fetching services:', err);
      return res.status(500).json({ message: 'Error fetching services' });
    }
    res.json(results);
  });
});

module.exports = router;

