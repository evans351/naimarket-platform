const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/orders - Place a new order
router.post('/', (req, res) => {
  const { customer_id, vendor_id, service_id, quantity } = req.body;

  if (!customer_id || !vendor_id || !service_id || !quantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = `INSERT INTO orders (customer_id, vendor_id, service_id, quantity) VALUES (?, ?, ?, ?)`;

  db.query(sql, [customer_id, vendor_id, service_id, quantity], (err, result) => {
    if (err) {
      console.error('❌ Order insert error:', err);
      return res.status(500).json({ message: 'Failed to place order' });
    }
    res.status(201).json({ message: 'Order placed successfully', orderId: result.insertId });
  });
});

// ✅ GET /api/orders?customer_id=...
router.get('/', (req, res) => {
  const customerId = req.query.customer_id;

  if (!customerId) {
    return res.status(400).json({ message: 'Missing customer_id' });
  }

  const sql = `
    SELECT orders.*, services.title AS service_title, vendors.name AS vendor_name
    FROM orders
    JOIN services ON orders.service_id = services.id
    JOIN vendors ON orders.vendor_id = vendors.id
    WHERE orders.customer_id = ?
    ORDER BY orders.created_at DESC
  `;

  db.query(sql, [customerId], (err, results) => {
    if (err) {
      console.error('❌ Error fetching orders:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});


module.exports = router;
