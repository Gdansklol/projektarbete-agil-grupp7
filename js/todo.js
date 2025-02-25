const currentUser = sessionStorage.getItem("currentUser");

if (!currentUser) {
    window.location.href = "/pages/login.html"; 
}

const todoForm = document.getElementById("todo-form");
const listContainer = document.getElementById("listContainer");
const addTodoButton = document.getElementById("add-todo");
const logoutButton = document.getElementById("logoutButton");

const saveTodos = () => {
    if (!currentUser) return;
    localStorage.setItem(`${currentUser}_todos`, JSON.stringify(todoList));
};

let todoList = JSON.parse(localStorage.getItem(`${currentUser}_todos`)) || [];
let editIndex = -1;

const now = new Date();
now.setHours(0, 0, 0, 0);

const renderTodos = (filteredTodos = todoList) => {
    listContainer.innerHTML = "";

    filteredTodos.forEach((todo, index) => {
        const deadlineDate = new Date(todo.deadline);
        deadlineDate.setHours(0, 0, 0, 0); 

        if (deadlineDate < now) {
            todo.status = "done";
        }

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

    saveTodos();
};

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

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0); 

    if (deadlineDate < now) {
        status = "done";
    }

    const newTodo = { title, description, status, time, category, deadline };

    if (editIndex > -1) {
        todoList[editIndex] = newTodo;
        editIndex = -1;
        addTodoButton.textContent = "Add Task";
    } else {
        todoList.push(newTodo);
    }

    renderTodos();
    todoForm.reset();
});

window.toggleComplete = (index) => {
    todoList[index].status = todoList[index].status === "done" ? "not-done" : "done";
    renderTodos();
};

window.removeTodo = (index) => {
    todoList.splice(index, 1);
    renderTodos();
};

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("currentUser");
        window.location.href = "/login.html";
    });
}

renderTodos();
