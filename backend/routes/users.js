const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');

// ✅ GET all users
router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// ✅ GET only admin users
router.get('/admins', (req, res) => {
  db.query("SELECT * FROM users WHERE role = 'admin'", (err, results) => {
    if (err) {
      console.error('Error fetching admin users:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// ✅ POST reset password
router.post('/reset-password', async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ message: 'Missing userId or new password' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql = 'UPDATE users SET password = ? WHERE id = ?';

    db.query(sql, [hashedPassword, userId], (err, result) => {
      if (err) {
        console.error('Reset password error:', err);
        return res.status(500).json({ message: 'Failed to reset password' });
      }

      res.json({ message: 'Password reset successful' });
    });
  } catch (err) {
    console.error('Hash error:', err);
    res.status(500).json({ message: 'Error hashing new password' });
  }
});

// Total user counts by role
router.get('/counts', (req, res) => {
  const sql = `
    SELECT 
      SUM(role = 'admin') AS admins,
      SUM(role = 'vendor') AS vendors,
      SUM(role = 'customer') AS customers 
    FROM users
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching user counts:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results[0]);
  });
});

// DELETE user by ID
router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});



module.exports = router;
