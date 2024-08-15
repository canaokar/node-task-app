document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    // Fetch tasks and display them
    function fetchTasks() {
        fetch('/api/tasks')
            .then(response => response.json())
            .then(data => {
                taskList.innerHTML = '';
                data.tasks.forEach(task => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <span>${task.title} - ${task.status} (Due: ${task.due_date || 'N/A'})</span>
                        <div>
                            <button onclick="editTask(${task.id})">Edit</button>
                            <button onclick="deleteTask(${task.id})">Delete</button>
                        </div>
                    `;
                    taskList.appendChild(listItem);
                });
            });
    }

    // Submit new task or update existing one
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const taskId = document.getElementById('task-id').value;
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const status = document.getElementById('status').value;
        const dueDate = document.getElementById('due-date').value;

        const taskData = {
            title,
            description,
            status,
            due_date: dueDate
        };

        if (taskId) {
            fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            }).then(fetchTasks);
        } else {
            fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            }).then(fetchTasks);
        }

        taskForm.reset();
        document.getElementById('task-id').value = '';
    });

    // Edit a task
    window.editTask = function (id) {
        fetch(`/api/tasks/${id}`)
            .then(response => response.json())
            .then(data => {
                const task = data.task;
                document.getElementById('task-id').value = task.id;
                document.getElementById('title').value = task.title;
                document.getElementById('description').value = task.description;
                document.getElementById('status').value = task.status;
                document.getElementById('due-date').value = task.due_date;
            });
    };

    // Delete a task
    window.deleteTask = function (id) {
        fetch(`/api/tasks/${id}`, { method: 'DELETE' })
            .then(fetchTasks);
    };

    // Initial fetch
    fetchTasks();
});
