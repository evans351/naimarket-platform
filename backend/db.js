// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'OMONDI@32064414', // 🔐 If you set a MySQL password, add it here
  database: 'naimarket_db'
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

module.exports = connection;
