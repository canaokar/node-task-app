# Node-Task-App

This project is a simple Task Manager web application built using Node.js, Express, and MySQL. It allows users to create, read, update, and delete tasks. This README will guide you through the setup, structure, and use of the project. This tutorial assumes you have a basic understanding of Node.js, Express, and MySQL.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Installation and Setup](#installation-and-setup)
3. [Running the Application](#running-the-application)
4. [Running MySQL with Docker](#running-mysql-with-docker)
5. [API Endpoints](#api-endpoints)
6. [Frontend Explanation](#frontend-explanation)
7. [Common Errors and Troubleshooting](#common-errors-and-troubleshooting)
8. [Additional Resources](#additional-resources)

## Project Structure

The project is structured as follows:

```
task-manager/
│
├── public/
│   ├── index.html
│   ├── scripts.js
│   └── styles.css (you can create this file to style your application)
│
├── server.js
└── README.md
```

- **`server.js`**: The main server-side script that handles API routes and serves the frontend.
- **`public/`**: This directory contains the frontend assets like HTML, JavaScript, and CSS files.
- **`index.html`**: The main HTML file for the frontend.
- **`scripts.js`**: The JavaScript file that handles the frontend logic.
- **`styles.css`**: (Optional) A CSS file for styling the application.

## Installation and Setup

Follow these steps to set up and run the project locally.

### Prerequisites

Make sure you have the following installed:

1. **Node.js** (v12.x or higher)
2. **MySQL** (v5.7 or higher) or **Docker** (if using Docker for MySQL)

### Steps

1. **Clone the Repository**

   Clone the repository to your local machine using the following command:

   ```bash
   git clone https://github.com/canaokar/node-task-app.git
   cd node-task-app
   ```

2. **Install Dependencies**

   Navigate to the project directory and install the necessary Node.js packages:

   ```bash
   npm install
   ```

3. **Configure MySQL Database**

   If you are using a local MySQL installation, follow these steps:

   - Start your MySQL server.
   - Open your MySQL client and run the following commands to create the database:

     ```sql
     CREATE DATABASE taskdb;
     USE taskdb;
     ```

   - The `server.js` file will automatically create the `tasks` table if it doesn't exist.

   Alternatively, if you are using Docker for MySQL, refer to the next section for instructions.

4. **Update MySQL Connection Details**

   Update the MySQL connection details in the `server.js` file:

   ```javascript
   const db = mysql.createConnection({
       host: 'localhost',
       port: 3306,
       user: 'root', // replace with your MySQL username
       password: 'nottingham', // replace with your MySQL password
       database: 'taskdb' // the name of your database
   });
   ```

## Running the Application

Once everything is set up, you can run the server using the following command:

```bash
node server.js
```

If everything is configured correctly, you should see the following output in your terminal:

```
Connected to the MySQL database.
Tasks table is ready.
Server is running on http://localhost:3000
```

Open your browser and go to `http://localhost:3000` to view the Task Manager application.

## Running MySQL with Docker

If you prefer to run MySQL in a Docker container, you can do so with the following command:

```bash
docker run --name mysql-task -p 3306:3306 -e MYSQL_ROOT_PASSWORD=nottingham -e MYSQL_DATABASE=taskdb -d mysql:latest
```

### Explanation of the Docker Command

- **`--name mysql-task`**: Names the container `mysql-task` for easy reference.
- **`-p 3306:3306`**: Maps port 3306 on your local machine to port 3306 in the container, making MySQL accessible locally.
- **`-e MYSQL_ROOT_PASSWORD=nottingham`**: Sets the MySQL root password to `nottingham`.
- **`-e MYSQL_DATABASE=taskdb`**: Automatically creates a database named `taskdb`.
- **`-d mysql:latest`**: Runs the latest version of MySQL in detached mode (in the background).

### Connecting to MySQL in Docker

With this setup, your MySQL database will be available at `localhost:3306`, and the `server.js` file's connection details should work without modification, provided you have configured it to connect to `localhost` on port `3306`.

## API Endpoints

The application exposes several API endpoints for managing tasks. Here's a summary:

- **GET `/api/tasks`**: Fetch all tasks.
  - **Response**: Returns a JSON array of all tasks.

- **POST `/api/tasks`**: Create a new task.
  - **Request Body**: JSON object with `title`, `description`, `status`, and `due_date`.
  - **Response**: Returns the ID of the created task.

- **PUT `/api/tasks/:id`**: Update an existing task by ID.
  - **Request Body**: JSON object with `title`, `description`, `status`, and `due_date`.
  - **Response**: Returns the number of affected rows.

- **DELETE `/api/tasks/:id`**: Delete a task by ID.
  - **Response**: Returns the number of affected rows.

## Frontend Explanation

The frontend is built using plain HTML, CSS, and JavaScript. Below is a breakdown of how it works:

### `index.html`

This file provides the structure of the webpage, which includes:

- A form to create or update tasks.
- A list that displays all the tasks.

### `scripts.js`

This JavaScript file handles all the interactions with the backend API:

- **`fetchTasks()`**: Fetches tasks from the server and displays them in the list.
- **`editTask(id)`**: Populates the form with the task data for editing.
- **`deleteTask(id)`**: Deletes a task and refreshes the task list.
- **Form Submission**: The form submission is handled to either create a new task or update an existing one based on whether an `id` is present.

### `styles.css` (Optional)

You can create a `styles.css` file in the `public` directory to style the application.

## Common Errors and Troubleshooting

- **MySQL Connection Error**: 
  - Make sure your MySQL server is running and the connection details in `server.js` are correct.
  - If you see `ER_ACCESS_DENIED_ERROR`, verify your username and password.
  
- **Port Already in Use**:
  - If port 3000 is already in use, either free it or change the `PORT` variable in `server.js` to another available port.

- **Cannot GET /**:
  - Ensure that the `public` directory is correctly named and that `index.html` exists in that directory.

## Additional Resources

- [Express.js Documentation](https://expressjs.com/en/starter/installing.html)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Docker Documentation](https://docs.docker.com/)

This guide should help you understand and set up the Task Manager application. If you encounter any issues or have any questions, feel free to consult the documentation or seek help online. Happy coding!