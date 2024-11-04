document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const notifications = document.getElementById('notifications');
    const filterStatusBtn = document.getElementById('filter-status');
    const filterPriorityBtn = document.getElementById('filter-priority');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let filter = 'all';

    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = filterTasks(tasks);
        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${isUrgent(task.dueDate) ? 'urgent' : ''}`;
            li.innerHTML = `
                ${task.name} - ${task.dueDate} - ${task.priority}
                <button onclick="editTask(${index})">Editar</button>
                <button onclick="deleteTask(${index})">Excluir</button>
            `;
            taskList.appendChild(li);
        });
        showNotifications();
    }

    function filterTasks(tasks) {
        return tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
            return true;
        });
    }

    function showNotifications() {
        notifications.innerHTML = '';
        tasks.forEach(task => {
            if (isUrgent(task.dueDate)) {
                notifications.innerHTML += `<div class="notification">A tarefa "${task.name}" está próxima do prazo!</div>`;
            }
        });
    }

    function isUrgent(dueDate) {
        const today = new Date();
        const due = new Date(dueDate);
        const timeDiff = due - today;
        return timeDiff > 0 && timeDiff <= 2 * 24 * 60 * 60 * 1000; // 2 dias
    }

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newTask = {
            name: document.getElementById('task-name').value,
            dueDate: document.getElementById('due-date').value,
            priority: document.getElementById('priority').value,
            completed: false,
        };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskForm.reset();
        renderTasks();
    });

    filterStatusBtn.addEventListener('click', () => {
        filter = (filter === 'all') ? 'completed' : (filter === 'completed') ? 'pending' : 'all';
        renderTasks();
    });

    filterPriorityBtn.addEventListener('click', () => {
        tasks.sort((a, b) => {
            const priorities = { alta: 1, media: 2, baixa: 3 };
            return priorities[a.priority] - priorities[b.priority];
        });
        renderTasks();
    });

    window.editTask = (index) => {
        const task = tasks[index];
        document.getElementById('task-name').value = task.name;
        document.getElementById('due-date').value = task.dueDate;
        document.getElementById('priority').value = task.priority;
        deleteTask(index);
    };

    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    renderTasks();
});