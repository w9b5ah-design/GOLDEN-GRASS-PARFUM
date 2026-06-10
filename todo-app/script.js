// To-Do List Application with Local Storage

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.editingId = null;
        
        // DOM Elements
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        
        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.attachEventListeners();
        this.render();
    }

    attachEventListeners() {
        // Add todo
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Clear actions
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) {
            alert('Please enter a task!');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        this.todos.unshift(todo);
        this.todoInput.value = '';
        this.saveToLocalStorage();
        this.render();
        this.todoInput.focus();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToLocalStorage();
            this.render();
        }
    }

    deleteTodo(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveToLocalStorage();
            this.render();
        }
    }

    editTodo(id) {
        this.editingId = id;
        this.render();
    }

    saveTodo(id, newText) {
        const text = newText.trim();
        if (!text) {
            alert('Task cannot be empty!');
            return;
        }

        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.text = text;
            this.editingId = null;
            this.saveToLocalStorage();
            this.render();
        }
    }

    cancelEdit() {
        this.editingId = null;
        this.render();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        if (completedCount === 0) {
            alert('No completed tasks to clear!');
            return;
        }

        if (confirm(`Delete ${completedCount} completed task(s)?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveToLocalStorage();
            this.render();
        }
    }

    clearAll() {
        if (this.todos.length === 0) {
            alert('No tasks to clear!');
            return;
        }

        if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone!')) {
            this.todos = [];
            this.saveToLocalStorage();
            this.render();
        }
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const remaining = total - completed;

        document.getElementById('totalCount').textContent = total;
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('remainingCount').textContent = remaining;
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        this.updateStats();

        // Clear current list
        this.todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <p>${this.currentFilter === 'all' ? 'No tasks yet. Add one to get started!' : `No ${this.currentFilter} tasks.`}</p>
                </div>
            `;
            return;
        }

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''} ${this.editingId === todo.id ? 'edit-mode' : ''}`;

            if (this.editingId === todo.id) {
                // Edit mode
                li.innerHTML = `
                    <input 
                        type="text" 
                        class="edit-input" 
                        value="${todo.text}"
                        id="edit-input-${todo.id}"
                    >
                    <div class="todo-actions">
                        <button class="save-btn">Save</button>
                        <button class="cancel-btn">Cancel</button>
                    </div>
                `;

                const editInput = li.querySelector(`#edit-input-${todo.id}`);
                const saveBtn = li.querySelector('.save-btn');
                const cancelBtn = li.querySelector('.cancel-btn');

                editInput.focus();
                editInput.select();

                saveBtn.addEventListener('click', () => this.saveTodo(todo.id, editInput.value));
                cancelBtn.addEventListener('click', () => this.cancelEdit());
                editInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.saveTodo(todo.id, editInput.value);
                    if (e.key === 'Escape') this.cancelEdit();
                });
            } else {
                // View mode
                li.innerHTML = `
                    <input 
                        type="checkbox" 
                        class="checkbox" 
                        ${todo.completed ? 'checked' : ''}
                    >
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <div class="todo-actions">
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                `;

                const checkbox = li.querySelector('.checkbox');
                const editBtn = li.querySelector('.edit-btn');
                const deleteBtn = li.querySelector('.delete-btn');

                checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
                editBtn.addEventListener('click', () => this.editTodo(todo.id));
                deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
            }

            this.todoList.appendChild(li);
        });
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving to local storage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem('todos');
            this.todos = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading from local storage:', error);
            this.todos = [];
        }
    }
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TodoApp();
    });
} else {
    new TodoApp();
}