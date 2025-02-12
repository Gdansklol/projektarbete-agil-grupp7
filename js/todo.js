let todoForm = document.getElementById("todo-form");
let listContainer = document.getElementById("listContainer");
let resetButton = document.getElementById("reset-todo");
let sortSelect = document.getElementById("sort-todo");
let filterButton = document.getElementById("filter-todos");
let filterStatus = document.getElementById("filter-todo-status");
let categoryStatus = document.querySelectorAll("input[name='filter-category']");
let addTodoButton = document.getElementById("add-todo");

let todoList = []; 
let editIndex = -1;

const addOrUpdateTodo = (event) => {
    event.preventDefault(); 

    const title = document.getElementById("todo-title").value.trim();
    const description = document.getElementById("todo-description").value.trim();
    const status = document.getElementById("todo-status").value;
    const time = document.getElementById("todo-time").value;
    const category = document.getElementById("todo-category").value;
    const deadline = document.getElementById("todo-deadline").value;

    if (!title || !description || !status || !time || !category || !deadline) {
        alert("⚠️ All fields must be filled!");
        return;
    }

    const newTodo = { title, description, status, time, category, deadline };

    if (editIndex > -1) {
        todoList[editIndex] = newTodo;
        editIndex = -1;
        addTodoButton.textContent = "Add Task";
    } else {
        todoList.push(newTodo);
    }

    console.log("Todo List:", todoList); 
    renderTodos();
    todoForm.reset();
};

const renderTodos = () => {
    listContainer.innerHTML = "";

    todoList.forEach((todo, index) => {
        const listItem = document.createElement("li");
        listItem.className = `todo-item ${todo.status === "done" ? "completed" : ""}`;

        listItem.innerHTML = `
            <input type="checkbox" class="check-task" onchange="toggleComplete(${index})" ${todo.status === "done" ? "checked" : ""}>
            <span class="todo-text" style="text-decoration: ${todo.status === "done" ? "line-through" : "none"}">
                <b>${todo.title}</b> - ${todo.description} (${todo.category}) [${todo.time}] - ${todo.deadline}
            </span>
            <button onclick="editTodo(${index})"><i class="fas fa-edit"></i></button>
            <button onclick="removeTodo(${index})"><i class="fas fa-trash"></i></button>
        `;

        listContainer.append(listItem);
    });
};

todoForm.addEventListener("submit", addOrUpdateTodo);
