const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db'); // Make sure db.js exports the MySQL connection

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const serviceRoutes = require('./routes/services'); // ✅ import routes
app.use('/api/services', serviceRoutes); // ✅ mount routes

const vendorRoutes = require('./routes/vendor');
app.use('/api/vendors', vendorRoutes);

const categoryRoutes = require('./routes/categories');
app.use('/api/categories', categoryRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('NaiMarket API is running!');
});

// ✅ Improved Login Route with debug logs
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
      console.warn('⚠️ No user found with email:', email);
      return res.status(401).json({ message: 'Invalid credentials (email not found)' });
    }

    const user = results[0];
    console.log('✅ User found:', user);

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('🔍 bcrypt.compare result:', isMatch);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials (password mismatch)' });
      }

      // Successful login
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (compareErr) {
      console.error('❌ bcrypt error:', compareErr);
      return res.status(500).json({ message: 'Server error during password check' });
    }
  });
});

// ✅ Registration route
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

// ✅ Vendor services (in-memory)
const vendorServices = [];

app.post('/api/vendor/services', (req, res) => {
  const service = req.body;
  vendorServices.push(service);
  console.log('New service added:', service);
  res.status(201).json({ message: 'Service added successfully' });
});

app.get('/api/services', (req, res) => {
  res.json(vendorServices);
});

// ✅ Logout (dummy)
app.post('/api/logout', (req, res) => {
  res.json({ message: 'User logged out successfully' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});


