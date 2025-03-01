const todoForm = document.getElementById("todo-form");
const listContainer = document.getElementById("listContainer");
const resetButton = document.getElementById("reset-todo");
const addTodoButton = document.getElementById("add-todo");
const sortSelect = document.getElementById("sort-todo");
const sortOrderRadios = document.querySelectorAll("input[name='sort-order']");
const sortButton = document.getElementById("sort-button");
const filterButton = document.getElementById("filter-todos");
const filterStatus = document.getElementById("filter-todo-status");
const categoryCheckboxes = document.querySelectorAll("input[name='filter-category']");
const selectAllCategories = document.getElementById("select-all-categories");

const currentUser = sessionStorage.getItem("currentUser");

if (!currentUser) {
    window.location.href = "/pages/login.html";
}

const getTodosFromStorage = () => {
    try {
        return JSON.parse(localStorage.getItem(`${currentUser}_todoList`)) || [];
    } catch (error) {
        console.error("Error parsing todoList from localStorage:", error);
        return [];
    }
};

const saveTodosToStorage = () => {
    try {
        localStorage.setItem(`${currentUser}_todoList`, JSON.stringify(todoList));
    } catch (error) {
        console.error("Error saving todoList to localStorage:", error);
    }
};

let todoList = getTodosFromStorage();
let editIndex = -1;

todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("todo-title").value.trim();
    const description = document.getElementById("todo-description").value.trim();
    const time = document.getElementById("todo-time").value;
    const category = document.getElementById("todo-category").value;
    const deadline = document.getElementById("todo-deadline").value;

    if (!title || !description || !time || !category || !deadline) {
        alert("⚠️ Please fill in all fields!");
        return;
    }

    const today = new Date().toISOString().split("T")[0];
    const status = deadline < today ? "done" : "not-done";

    const newTodo = { title, description, status, time, category, deadline };

    if (editIndex > -1) {
        todoList[editIndex] = newTodo;
        editIndex = -1;
        addTodoButton.textContent = "Add Task";
    } else {
        todoList.push(newTodo);
    }

    saveTodosToStorage();
    todoForm.reset();
    renderTodos();
    updateStartPageTodos();
});

addTodoButton.addEventListener("click", (event) => {
    event.preventDefault();
    todoForm.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
});

window.removeTodo = (index) => {
    todoList.splice(index, 1);
    saveTodosToStorage();
    renderTodos();
    updateStartPageTodos();
};

window.editTodo = (index) => {
    const todo = todoList[index];

    document.getElementById("todo-title").value = todo.title;
    document.getElementById("todo-description").value = todo.description;
    document.getElementById("todo-time").value = todo.time;
    document.getElementById("todo-category").value = todo.category;
    document.getElementById("todo-deadline").value = todo.deadline;

    editIndex = index;
    addTodoButton.textContent = "Update Task";
};

window.toggleComplete = (index) => {
    const today = new Date().toISOString().split("T")[0];
    const todo = todoList[index];

    if (todo.deadline > today) {
        alert("⚠️ This task is scheduled for the future. Are you from the future? 😆");
        renderTodos(); 
        return;
    }

    todo.status = todo.status === "done" ? "not-done" : "done";
    saveTodosToStorage();
    renderTodos();
    updateStartPageTodos();
};

const renderTodos = () => {
    listContainer.innerHTML = "";

    todoList.forEach((todo, index) => {
        const today = new Date().toISOString().split("T")[0];
        const isPast = todo.deadline < today;

        const listItem = document.createElement("li");
        listItem.className = `todo-item ${todo.status === "done" ? "completed" : ""}`;

        listItem.innerHTML = `
            <input type="checkbox" class="check-task" onchange="toggleComplete(${index})" 
                ${todo.status === "done" ? "checked" : ""} ${isPast ? "disabled" : ""}>
            <span class="todo-text" style="text-decoration: ${todo.status === "done" ? "line-through" : "none"}">
                <b>${todo.title}</b> - ${todo.description} (${todo.category}) [${todo.time}] - ${todo.deadline}
            </span>
            <button onclick="editTodo(${index})"><i class="fas fa-edit"></i></button>
            <button onclick="removeTodo(${index})"><i class="fas fa-trash"></i></button>
        `;
        listContainer.appendChild(listItem);
    });

    saveTodosToStorage();
};


renderTodos();
updateStartPageTodos();

function updateStartPageTodos() {
    const startPageTodoList = document.querySelector("#todoList");

    if (!startPageTodoList) return; 

    const todos = getTodosFromStorage();
    const pendingTodos = todos.filter(todo => todo.status !== "done");
    
    pendingTodos.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)); 
    const latestThreeTodos = pendingTodos.slice(0, 3);

    startPageTodoList.innerHTML = latestThreeTodos.length
        ? latestThreeTodos
            .map(todo => `<li>${todo.title} - ${todo.deadline} (${todo.category})</li>`)
            .join("")
        : "<li>No pending tasks found.</li>";
}
