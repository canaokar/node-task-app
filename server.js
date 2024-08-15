const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root', // replace with your MySQL username
    password: 'nottingham', // replace with your MySQL password
    database: 'taskdb' // the name of your database
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Failed to connect to the MySQL database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database.');

    // Create tasks table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(50) NOT NULL DEFAULT 'pending',
            due_date DATE
        )
    `;
    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('Failed to create tasks table:', err.message);
            return;
        }
        console.log('Tasks table is ready.');
    });
});

// API routes
app.get('/api/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ tasks: results });
    });
});

app.post('/api/tasks', (req, res) => {
    const { title, description, status, due_date } = req.body;
    const insertQuery = 'INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [title, description, status, due_date], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: result.insertId });
    });
});

app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status, due_date } = req.body;
    const updateQuery = 'UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ?';
    db.query(updateQuery, [title, description, status, due_date, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: result.affectedRows });
    });
});

app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const deleteQuery = 'DELETE FROM tasks WHERE id = ?';
    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: result.affectedRows });
    });
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
