const express = require('express');
const mysql = require('mysql2');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Update with your MySQL user credentials
  password: 'Daisy254.', // Update with your MySQL password
  database: 'touring_kenya',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.log('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Kenya Touring Backend!');
});

// 1. **Create a new tour**
app.post('/tours', (req, res) => {
  const { title, description, location, price } = req.body;
  
  db.query(
    'INSERT INTO tours (title, description, location, price) VALUES (?, ?, ?, ?)',
    [title, description, location, price],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error adding tour' });
      }
      res.status(201).json({ message: 'Tour added successfully', tourId: result.insertId });
    }
  );
});

// 2. **Get all tours**
app.get('/tours', (req, res) => {
  db.query('SELECT * FROM tours', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching tours' });
    }
    res.status(200).json(results);
  });
});

// 3. **Get a specific tour**
app.get('/tours/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM tours WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching tour' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.status(200).json(result[0]);
  });
});

// 4. **Create a user (sign up)**
app.post('/users', (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  db.query(
    'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
    [first_name, last_name, email, password], // In production, you should hash the password
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error creating user' });
      }
      res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    }
  );
});

// 5. **User login (simple)** - In a real application, you'd compare hashed passwords
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password], // In production, use hashed password comparison
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error during login' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.status(200).json({ message: 'Login successful', user: results[0] });
    }
  );
});

// 6. **Booking a tour**
app.post('/bookings', (req, res) => {
  const { user_id, tour_id } = req.body;

  db.query(
    'INSERT INTO bookings (user_id, tour_id) VALUES (?, ?)',
    [user_id, tour_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error booking tour' });
      }
      res.status(201).json({ message: 'Booking successful', bookingId: result.insertId });
    }
  );
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3060');
});
