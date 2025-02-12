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

    const newTodo = {title, description, status, time, category, deadline};

    if (editIndex > -1) {
        todoList[editIndex] = newTodo;
        editIndex = -1;
        addTodoButton.textContent = "Add Task";
    } else {
        todoList.push(newTodo);
    }
    renderTodos(todoList);
    todoForm.reset();
});

const renderTodos = (todos) => {

    listContainer.innerHTML = "";

    todos.forEach((todo, index) => {
        let listItem = document.createElement("li");
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

window.toggleComplete = (index) => {
    todoList[index].status = todoList[index].status === "done" ? "not-done" : "done";
    renderTodos(todoList);
};

window.removeTodo = (index) => {
    todoList.splice(index, 1);
    renderTodos(todoList);
};

window.editTodo = (index) => {
    let todo = todoList[index];

    document.getElementById("todo-title").value = todo.title;
    document.getElementById("todo-description").value = todo.description;
    document.getElementById("todo-status").value = todo.status;
    document.getElementById("todo-time").value = todo.time;
    document.getElementById("todo-category").value = todo.category;
    document.getElementById("todo-deadline").value = todo.deadline;

    editIndex = index;
    addTodoButton.textContent = "Edit Task";
};

filterButton.addEventListener("click", () => {
   let selectedStatus = filterStatus.value;
    let filteredTodos = todoList;

    if (selectedStatus === "done") {
        filteredTodos = todoList.filter(todo => todo.status === "done");
    } else if (selectedStatus === "not-done") {
        filteredTodos = todoList.filter(todo => todo.status === "not-done");
    }

    renderTodos(filteredTodos);
});
