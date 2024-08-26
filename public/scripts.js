// Wait until the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form'); // Reference to the task form element
    const taskList = document.getElementById('task-list'); // Reference to the task list element

    // Function to fetch all tasks from the server and display them
    function fetchTasks() {
        fetch('/api/tasks') // Send a GET request to the /api/tasks endpoint
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                taskList.innerHTML = ''; // Clear the existing task list

                // Loop through the tasks and create list items for each task
                data.tasks.forEach(task => {
                    const listItem = document.createElement('li'); // Create a new list item element

                    // Set the inner HTML of the list item with task details and action buttons
                    listItem.innerHTML = `
                        <span>${task.title} - ${task.status} (Due: ${task.due_date || 'N/A'})</span>
                        <div>
                            <button onclick="editTask(${task.id})">Edit</button> <!-- Button to edit the task -->
                            <button onclick="deleteTask(${task.id})">Delete</button> <!-- Button to delete the task -->
                        </div>
                    `;
                    taskList.appendChild(listItem); // Append the list item to the task list
                });
            });
    }

    // Event listener for form submission to either create a new task or update an existing one
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission behavior

        const taskId = document.getElementById('task-id').value; // Get the ID of the task being edited (if any)
        const title = document.getElementById('title').value; // Get the title input value
        const description = document.getElementById('description').value; // Get the description input value
        const status = document.getElementById('status').value; // Get the selected status value
        const dueDate = document.getElementById('due-date').value; // Get the due date input value

        // Create an object with the task data to send to the server
        const taskData = {
            title,
            description,
            status,
            due_date: dueDate
        };

        // Determine if the form is for creating a new task or updating an existing one
        if (taskId) {
            // Update an existing task (PUT request)
            fetch(`/api/tasks/${taskId}`, {
                method: 'PUT', // Use the PUT method to update the task
                headers: { 'Content-Type': 'application/json' }, // Set the request headers
                body: JSON.stringify(taskData) // Send the task data as a JSON string
            }).then(fetchTasks); // Refresh the task list after the update
        } else {
            // Create a new task (POST request)
            fetch('/api/tasks', {
                method: 'POST', // Use the POST method to create a new task
                headers: { 'Content-Type': 'application/json' }, // Set the request headers
                body: JSON.stringify(taskData) // Send the task data as a JSON string
            }).then(fetchTasks); // Refresh the task list after the creation
        }

        taskForm.reset(); // Reset the form fields
        document.getElementById('task-id').value = ''; // Clear the hidden task ID field
    });

    // Function to edit a task (called when the Edit button is clicked)
    window.editTask = function (id) {
        // Fetch the task data from the server by ID
        fetch(`/api/tasks/${id}`)
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                const task = data.task; // Get the task data from the response

                // Populate the form fields with the task data
                document.getElementById('task-id').value = task.id; // Set the hidden task ID field
                document.getElementById('title').value = task.title; // Set the title input field
                document.getElementById('description').value = task.description; // Set the description textarea
                document.getElementById('status').value = task.status; // Set the status dropdown
                document.getElementById('due-date').value = task.due_date; // Set the due date input field
            });
    };

    // Function to delete a task (called when the Delete button is clicked)
    window.deleteTask = function (id) {
        // Send a DELETE request to the server to delete the task by ID
        fetch(`/api/tasks/${id}`, { method: 'DELETE' })
            .then(fetchTasks); // Refresh the task list after deletion
    };

    // Initial fetch to display the tasks when the page loads
    fetchTasks();
});
