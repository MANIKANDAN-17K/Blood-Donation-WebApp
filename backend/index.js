const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Azure App Service sets PORT automatically, fallback to 5000
const PORT = process.env.PORT || 5000;

// MySQL connection (replace with your Azure MySQL credentials)
const db = mysql.createConnection({
    host: 'your-mysql-server.mysql.database.azure.com', // Azure MySQL host
    user: 'your_username@your-mysql-server',           // Azure MySQL username
    password: 'your_password',                         // Azure MySQL password
    database: 'blood_donation'
});

// Middleware
app.use(cors({
    origin: 'https://your-frontend.azurewebsites.net', // frontend URL
    credentials: true
}));
app.use(bodyParser.json());

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes

// Get all donors
app.get('/api/donors', (req, res) => {
    const sql = 'SELECT * FROM donors ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add new donor
app.post('/api/donors', (req, res) => {
    const { name, email, phone, blood_group, age, address } = req.body;
    const sql = 'INSERT INTO donors (name, email, phone, blood_group, age, address) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, email, phone, blood_group, age, address], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Donor registered successfully', id: result.insertId });
    });
});

// Search donors by blood group
app.get('/api/donors/search/:bloodGroup', (req, res) => {
    const { bloodGroup } = req.params;
    const sql = 'SELECT * FROM donors WHERE blood_group = ? ORDER BY created_at DESC';
    db.query(sql, [bloodGroup], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Delete donor
app.delete('/api/donors/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM donors WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Donor deleted successfully' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
