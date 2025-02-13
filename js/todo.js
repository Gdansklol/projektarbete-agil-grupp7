let todoForm = document.getElementById("todo-form");
let listContainer = document.getElementById("listContainer");
let resetButton = document.getElementById("reset-todo");
let sortSelect = document.getElementById("sort-todo");
let sortButton = document.getElementById("sort-button");
let filterButton = document.getElementById("filter-todos");
let filterStatus = document.getElementById("filter-todo-status");
let categoryRadios = document.querySelectorAll("input[name='filter-category']");
let addTodoButton = document.getElementById("add-todo");

let todoList = JSON.parse(localStorage.getItem("todoList")) || [];
let editIndex = -1;

todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let title = document.getElementById("todo-title").value.trim();
    let description = document.getElementById("todo-description").value.trim();
    let status = document.getElementById("todo-status").value;
    let time = document.getElementById("todo-time").value;
    let category = document.getElementById("todo-category").value;
    let deadline = document.getElementById("todo-deadline").value;

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

    localStorage.setItem("todoList", JSON.stringify(todoList));
    todoForm.reset();
    renderTodos();
});

const renderTodos = (filteredTodos = todoList) => {
    listContainer.innerHTML = "";

    filteredTodos.forEach((todo, index) => {
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
        listContainer.appendChild(listItem);
    });

    localStorage.setItem("todoList", JSON.stringify(todoList));
};

window.toggleComplete = (index) => {
    todoList[index].status = todoList[index].status === "done" ? "not-done" : "done";
    renderTodos();
};

window.removeTodo = (index) => {
    todoList.splice(index, 1);
    renderTodos();
};

window.editTodo = (index) => {
    const todo = todoList[index];

    document.getElementById("todo-title").value = todo.title;
    document.getElementById("todo-description").value = todo.description;
    document.getElementById("todo-status").value = todo.status;
    document.getElementById("todo-time").value = todo.time;
    document.getElementById("todo-category").value = todo.category;
    document.getElementById("todo-deadline").value = todo.deadline;

    editIndex = index;
    addTodoButton.textContent = "Update task";
};

filterButton.addEventListener("click", () => {
    let filteredTodos = todoList;

    let selectedStatus = filterStatus.value;
    filteredTodos = selectedStatus !== "all" ? filteredTodos.filter(todo => todo.status === selectedStatus) : filteredTodos;

    let selectedCategory = null;
    categoryRadios.forEach(radio => {
        if (radio.checked) selectedCategory = radio.value;
    });
    filteredTodos = selectedCategory ? filteredTodos.filter(todo => todo.category === selectedCategory) : filteredTodos;

    renderTodos(filteredTodos);
});

sortButton.addEventListener("click", () => {
    const sortBy = sortSelect.value;

    if (sortBy === "deadline") {
        todoList.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sortBy === "time") {
        todoList.sort((a, b) => parseInt(a.time) - parseInt(b.time));
    } else if (sortBy === "status") {
        todoList.sort((a, b) => {
            if (a.status === b.status) {
                return new Date(a.deadline) - new Date(b.deadline);
            }
            return a.status === "done" ? 1 : -1;
        });
    }

    renderTodos();
});

resetButton.addEventListener("click", () => {
    if (confirm("⚠️ Do you really want to reset the list?")) {
        localStorage.removeItem("todoList");
        todoList = [];
        renderTodos();
    }
});

renderTodos();
