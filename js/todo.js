let todoForm = document.getElementById("todo-form");
let listContainer = document.getElementById("listContainer");
let resetButton = document.getElementById("reset-todo");
let sortSelect = document.getElementById("sort-todo");
let sortButton = document.getElementById("sort-button");
let filterButton = document.getElementById("filter-todos");
let filterStatus = document.getElementById("filter-todo-status");
let categoryCheckboxes = document.querySelectorAll("input[name='filter-category']");
let selectAllCategories = document.getElementById("select-all-categories");
let addTodoButton = document.getElementById("add-todo");

let currentUser = sessionStorage.getItem("currentUser");

if (!currentUser) {
    window.location.href = "/pages/login.html";
}

function getTodosFromStorage() {
    const todosData = localStorage.getItem(`${currentUser}_todoList`);
    return todosData ? JSON.parse(todosData) : [];
}

function saveTodosToStorage(todos) {
    localStorage.setItem(`${currentUser}_todoList`, JSON.stringify(todos));
}

let todoList = getTodosFromStorage();
let editIndex = -1;

todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let title = document.getElementById("todo-title").value.trim();
    let description = document.getElementById("todo-description").value.trim();
    let time = document.getElementById("todo-time").value;
    let category = document.getElementById("todo-category").value;
    let deadline = document.getElementById("todo-deadline").value;

    console.log("DEBUG: ", { title, description, time, category, deadline });

    if (!title || !description || !time || !category || !deadline) {
        alert("⚠️ Please fill in all fields!");
        return;
    }

    let today = new Date().toISOString().split("T")[0]; 
    let status = deadline < today ? "done" : "not-done"; 

    const newTodo = { title, description, status, time, category, deadline };

    if (editIndex > -1) {
        todoList[editIndex] = newTodo;
        editIndex = -1;
        addTodoButton.textContent = "Add Task";
    } else {
        todoList.push(newTodo);
    }

    saveTodosToStorage(todoList);
    todoForm.reset();
    renderTodos();
});

addTodoButton.addEventListener("click", (event) => {
    event.preventDefault();
    todoForm.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
});

const renderTodos = (filteredTodos = todoList) => {
    listContainer.innerHTML = "";

    filteredTodos.forEach((todo, index) => {
        let today = new Date().toISOString().split("T")[0];
        let isPast = todo.deadline < today;

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

    saveTodosToStorage(todoList);
};

window.toggleComplete = (index) => {
    let today = new Date().toISOString().split("T")[0];
    let todo = todoList[index];

    if (todo.deadline < today && todo.status === "done") {
        alert("⚠️ You cannot mark a past task as incomplete!");
        renderTodos(); 
        return;
    }

    if (todo.deadline > today && todo.status === "not-done") {
        alert("⚠️ This task is scheduled for the future. Are you from the future? 😆");
        renderTodos();
        return;
    }

    todo.status = todo.status === "done" ? "not-done" : "done";
    renderTodos();
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

window.removeTodo = (index) => {
    todoList.splice(index, 1);
    renderTodos();
};

filterButton.addEventListener("click", () => {
    let filteredTodos = [...todoList];

    let selectedStatus = filterStatus.value;
    if (selectedStatus !== "all") {
        filteredTodos = filteredTodos.filter(todo => todo.status === selectedStatus);
    }

    let selectedCategories = Array.from(categoryCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    if (selectedCategories.length > 0) {
        filteredTodos = filteredTodos.filter(todo => selectedCategories.includes(todo.category));
    }

    renderTodos(filteredTodos);
});

selectAllCategories.addEventListener("change", (event) => {
    let isChecked = event.target.checked;
    categoryCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
    });
});

sortButton.addEventListener("click", () => {
    let sortBy = sortSelect.value;
    let order = document.querySelector('input[name="sort-order"]:checked').value;

    let filteredTodos = [...todoList];

    if (filterStatus.value !== "all") {
        filteredTodos = filteredTodos.filter(todo => todo.status === filterStatus.value);
    }

    let selectedCategories = Array.from(categoryCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    if (selectedCategories.length > 0) {
        filteredTodos = filteredTodos.filter(todo => selectedCategories.includes(todo.category));
    }

    filteredTodos.sort((a, b) => {
        let valueA, valueB;

        if (sortBy === "status") {
            if (a.status !== b.status) {
                return a.status === "not-done" ? -1 : 1;
            }
            valueA = new Date(a.deadline);
            valueB = new Date(b.deadline);
        } else if (sortBy === "deadline") {
            valueA = new Date(a.deadline);
            valueB = new Date(b.deadline);
        } else {
            valueA = parseInt(a.time, 10);
            valueB = parseInt(b.time, 10);
        }

        return order === "asc" ? valueA - valueB : valueB - valueA;
    });

    renderTodos(filteredTodos);
});

resetButton.addEventListener("click", () => {
    if (confirm("⚠️ Do you really want to reset the list?")) {
        localStorage.removeItem(`${currentUser}_todoList`);
        todoList = [];
        renderTodos();
    }
});

renderTodos();

if (document.getElementById("logoutButton")) {
    document.getElementById("logoutButton").addEventListener("click", (event) => {
        event.preventDefault();
        sessionStorage.removeItem("currentUser");
        window.location.href = "login.html";
    });
};
