const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('NaiMarket API is running!');
});

// ✅ Vendor login route
app.post('/api/vendor/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Vendor login attempt:', email, password);

  if (email === 'vendor@example.com' && password === '123456') {
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// ✅ Customer login route
app.post('/api/customer/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Customer login attempt:', email, password);

  if (email === 'customer@example.com' && password === '654321') {
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid customer credentials' });
  }
});

// ✅ Registration route
app.post('/api/register', (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(`New ${role} registration:`, name, email);

  // Just simulate success for now
  res.status(201).json({ message: `${role} registered successfully` });
});

// ✅ In-memory vendor service storage
const vendorServices = [];

// ✅ Vendor adds a new service
app.post('/api/vendor/services', (req, res) => {
  const service = req.body;
  vendorServices.push(service);
  console.log('New service added:', service);
  res.status(201).json({ message: 'Service added successfully' });
});

// ✅ Customer fetches available services
app.get('/api/services', (req, res) => {
  res.json(vendorServices);
});

// ✅ Vendor logout
app.post('/api/vendor/logout', (req, res) => {
  console.log('Vendor logout request received');
  res.json({ message: 'Vendor logged out successfully' });
});

// ✅ Customer logout
app.post('/api/customer/logout', (req, res) => {
  console.log('Customer logout request received');
  res.json({ message: 'Customer logged out successfully' });
});


// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



