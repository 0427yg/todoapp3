document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');
    const filterAll = document.getElementById('filter-all');
    const filterActive = document.getElementById('filter-active');
    const filterCompleted = document.getElementById('filter-completed');
    const itemsLeft = document.getElementById('items-left');
    const clearCompleted = document.getElementById('clear-completed');
    
    // Load todos from localStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let filter = 'all';
    
    // Render todos
    const renderTodos = () => {
        todoList.innerHTML = '';
        
        const filteredTodos = todos.filter(todo => {
            if (filter === 'active') return !todo.completed;
            if (filter === 'completed') return todo.completed;
            return true;
        });
        
        filteredTodos.forEach((todo, index) => {
            const li = document.createElement('li');
            
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item');
            if (todo.completed) {
                todoItem.classList.add('completed');
            }
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => toggleComplete(todo.id));
            
            const todoText = document.createElement('span');
            todoText.textContent = todo.text;
            
            todoItem.appendChild(checkbox);
            todoItem.appendChild(todoText);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.innerHTML = '×';
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
            
            li.appendChild(todoItem);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
        
        updateItemsLeft();
    };
    
    // Add a new todo
    const addTodo = () => {
        const text = todoInput.value.trim();
        if (text !== '') {
            const todo = {
                id: Date.now(),
                text,
                completed: false
            };
            
            todos.push(todo);
            saveTodos();
            todoInput.value = '';
            renderTodos();
        }
    };
    
    // Toggle todo completion status
    const toggleComplete = (id) => {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        
        saveTodos();
        renderTodos();
    };
    
    // Delete a todo
    const deleteTodo = (id) => {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    };
    
    // Clear all completed todos
    const clearCompletedTodos = () => {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    };
    
    // Save todos to localStorage
    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };
    
    // Update items left counter
    const updateItemsLeft = () => {
        const activeCount = todos.filter(todo => !todo.completed).length;
        itemsLeft.textContent = `${activeCount} 項目が残っています`;
    };
    
    // Set active filter
    const setFilter = (selectedFilter) => {
        filter = selectedFilter;
        
        // Update active class for filter buttons
        filterAll.classList.remove('active');
        filterActive.classList.remove('active');
        filterCompleted.classList.remove('active');
        
        if (selectedFilter === 'all') {
            filterAll.classList.add('active');
        } else if (selectedFilter === 'active') {
            filterActive.classList.add('active');
        } else if (selectedFilter === 'completed') {
            filterCompleted.classList.add('active');
        }
        
        renderTodos();
    };
    
    // Event listeners
    addButton.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    filterAll.addEventListener('click', () => setFilter('all'));
    filterActive.addEventListener('click', () => setFilter('active'));
    filterCompleted.addEventListener('click', () => setFilter('completed'));
    clearCompleted.addEventListener('click', clearCompletedTodos);
    
    // Initial render
    renderTodos();
});
