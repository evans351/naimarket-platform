const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Route Imports
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const vendorRoutes = require('./routes/vendor');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');

// ✅ Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);  // ✅ MySQL-based services
app.use('/api/vendors', vendorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('NaiMarket API is running!');
});

// ✅ Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log('🔐 Login attempt with email:', email);

  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('❌ DB Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials (email not found)' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials (password mismatch)' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});

// ✅ Register
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';

  db.query(sql, [name, email, hashedPassword, role], (err) => {
    if (err) {
      console.error('Registration error:', err);
      return res.status(500).json({ message: 'Error registering user' });
    }

    res.status(201).json({ message: `${role} registered successfully` });
  });
});

// ✅ Dummy logout
app.post('/api/logout', (req, res) => {
  res.json({ message: 'User logged out successfully' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});


