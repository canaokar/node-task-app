// Import required modules
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = 3000; // Set the port to 3000

// Middleware to handle JSON and URL-encoded form data
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads
app.use(express.static('public')); // Serve static files from the 'public' directory

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root', // replace with your MySQL username
    password: 'nottingham', // replace with your MySQL password
    database: 'taskdb' // the name of your database
});

// Connect to MySQL database
db.connect(err => {
    if (err) {
        console.error('Failed to connect to the MySQL database:', err.message);
        return; // Exit if there's an error in connection
    }
    console.log('Connected to the MySQL database.');

    // SQL query to create the 'tasks' table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(50) NOT NULL DEFAULT 'pending',
            due_date DATE
        )
    `;

    // Execute the query to create the table
    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('Failed to create tasks table:', err.message);
            return; // Exit if there's an error in creating the table
        }
        console.log('Tasks table is ready.');
    });
});

// API route to fetch all tasks
app.get('/api/tasks', (req, res) => {
    // SQL query to select all tasks from the 'tasks' table
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message }); // Return 500 if there's an error
            return;
        }
        res.json({ tasks: results }); // Return the list of tasks as JSON
    });
});

// API route to create a new task
app.post('/api/tasks', (req, res) => {
    const { title, description, status, due_date } = req.body; // Extract task data from request body

    // SQL query to insert a new task into the 'tasks' table
    const insertQuery = 'INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)';
    
    // Execute the query with the provided task data
    db.query(insertQuery, [title, description, status, due_date], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message }); // Return 500 if there's an error
            return;
        }
        res.json({ id: result.insertId }); // Return the ID of the newly created task
    });
});

// API route to update an existing task by ID
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params; // Get the task ID from the request parameters
    const { title, description, status, due_date } = req.body; // Extract updated task data from request body

    // SQL query to update the task with the given ID
    const updateQuery = 'UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ?';
    
    // Execute the query with the updated task data
    db.query(updateQuery, [title, description, status, due_date, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message }); // Return 500 if there's an error
            return;
        }
        res.json({ changes: result.affectedRows }); // Return the number of affected rows
    });
});

// API route to delete a task by ID
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params; // Get the task ID from the request parameters

    // SQL query to delete the task with the given ID
    const deleteQuery = 'DELETE FROM tasks WHERE id = ?';

    // Execute the query to delete the task
    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message }); // Return 500 if there's an error
            return;
        }
        res.json({ changes: result.affectedRows }); // Return the number of affected rows
    });
});

// Serve the frontend (index.html) on the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the main HTML file
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Log a message when the server starts
});
