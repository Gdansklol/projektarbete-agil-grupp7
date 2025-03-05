const todoForm = document.getElementById("todo-form");
const listContainer = document.getElementById("listContainer");
const addTodoButton = document.getElementById("add-todo");
const sortSelect = document.getElementById("sort-todo");
const sortButton = document.getElementById("sort-button");
const filterButton = document.getElementById("filter-todos");
const filterStatus = document.getElementById("filter-todo-status");
const categoryCheckboxes = document.querySelectorAll("input[name='filter-category']");
const selectAllCategories = document.getElementById("select-all-categories");
const sortOrderRadios = document.querySelectorAll("input[name='sort-order']");

let currentUser = sessionStorage.getItem("currentUser");

if (!currentUser) {
    currentUser = localStorage.getItem("lastUser");
    if (!currentUser) {
        window.location.href = "/pages/login.html";
    } else {
        sessionStorage.setItem("currentUser", currentUser);
    }
}

const getTodosFromStorage = () => {
    const storedTodos = localStorage.getItem(`${currentUser}_todoList`);
    return storedTodos ? JSON.parse(storedTodos) : [];
};

const saveTodosToStorage = () => {
    localStorage.setItem(`${currentUser}_todoList`, JSON.stringify(todoList));
    localStorage.setItem("lastUser", currentUser);
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
    const today = new Date().toISOString().split("T")[0];

    if (!title || !description || !time || !category || !deadline) {
        alert("⚠️ Please fill in all fields!");
        return;
    }

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
});

window.removeTodo = (index) => {
    if (confirm("Are you sure you want to delete this task?")) {
        todoList.splice(index, 1);
        saveTodosToStorage();
        renderTodos();
    }
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

    if (todo.deadline < today && todo.status === "done") {
        alert("⚠️ You cannot uncheck a past completed task. Are you from the past? 😆");
        renderTodos();
        return;
    }

    if (todo.deadline > today && todo.status === "not-done") {
        alert("⚠️ This task is scheduled for the future. Are you from the future? 😆");
        renderTodos();
        return;
    }

    todo.status = todo.status === "done" ? "not-done" : "done";
    saveTodosToStorage();
    renderTodos();
};

sortButton.addEventListener("click", () => {
    const sortBy = sortSelect.value;
    const order = document.querySelector("input[name='sort-order']:checked")?.value || "asc";

    if (sortBy === "time") {
        todoList.sort((a, b) => order === "asc" ? parseInt(a.time) - parseInt(b.time) : parseInt(b.time) - parseInt(a.time));

    } else if (sortBy === "status") {
        let doneTodos = todoList.filter(todo => todo.status === "done");
        let notDoneTodos = todoList.filter(todo => todo.status === "not-done");

        doneTodos.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        notDoneTodos.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        if (order === "asc") {
            todoList = [...doneTodos, ...notDoneTodos];
        } 
     
        else {
            notDoneTodos.reverse();  
            doneTodos.reverse();  
            todoList = [...notDoneTodos, ...doneTodos];
        }

    } else if (sortBy === "deadline") {
      
        todoList.sort((a, b) => order === "asc" ? new Date(a.deadline) - new Date(b.deadline) : new Date(b.deadline) - new Date(a.deadline));
    }

    renderTodos();
});

const renderTodos = (filteredTodos = todoList) => {
    listContainer.innerHTML = "";

    filteredTodos.forEach((todo, index) => {
        const listItem = document.createElement("li");
        listItem.className = `todo-item ${todo.status === "done" ? "completed" : ""}`;

        listItem.innerHTML = `
            <input type="checkbox" class="check-task" data-index="${index}" onchange="toggleComplete(${index})" 
                ${todo.status === "done" ? "checked" : ""}>
            <span class="todo-text">
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
