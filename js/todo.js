const todoForm = document.getElementById("todo-form");
const listContainer = document.getElementById("listContainer");
const addTodoButton = document.getElementById("add-todo");
const sortSelect = document.getElementById("sort-todo");
const sortButton = document.getElementById("sort-button");
const sortOrderRadios = document.querySelectorAll("input[name='sort-order']");
const filterButton = document.getElementById("filter-todos");
const filterStatus = document.getElementById("filter-todo-status");
const categoryCheckboxes = document.querySelectorAll("input[name='filter-category']");
const selectAllCategories = document.getElementById("select-all-categories");

const currentUser = sessionStorage.getItem("currentUser");
if (!currentUser) {
    window.location.href = "/pages/login.html";
}

const getTodosFromStorage = () => JSON.parse(localStorage.getItem(`${currentUser}_todoList`)) || [];
const saveTodosToStorage = () => localStorage.setItem(`${currentUser}_todoList`, JSON.stringify(todoList));

let todoList = getTodosFromStorage();
let editIndex = -1;

const addTodo = (event) => {
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
};

const toggleComplete = (index) => {
    const today = new Date(); 
    const todo = todoList[index];
    const todoDate = new Date(todo.deadline);

    console.log(`Checking Task: ${todo.title}, Deadline: ${todoDate}, Status: ${todo.status}`); // Debugging

    if (todoDate < today && todo.status === "done") {
        alert("⚠️ You cannot mark a past completed task as incomplete.");
        renderTodos(); 
        return;
    }

    if (todoDate > today && todo.status === "not-done") {
        alert("⚠️ You cannot complete a future task.");
        renderTodos();
        return;
    }

    todo.status = todo.status === "done" ? "not-done" : "done";
    saveTodosToStorage();
    renderTodos();
};


const editTodo = (index) => {
    const todo = todoList[index];

    document.getElementById("todo-title").value = todo.title;
    document.getElementById("todo-description").value = todo.description;
    document.getElementById("todo-time").value = todo.time;
    document.getElementById("todo-category").value = todo.category;
    document.getElementById("todo-deadline").value = todo.deadline;

    editIndex = index;
    addTodoButton.textContent = "Update Task";
};

const removeTodo = (index) => {
    if (confirm("Are you sure you want to delete this task?")) {
        todoList.splice(index, 1);
        saveTodosToStorage();
        renderTodos();
    }
};

const sortTodos = () => {
    const sortBy = sortSelect.value;
    const order = document.querySelector("input[name='sort-order']:checked")?.value || "asc";

    todoList.sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];

        if (sortBy === "deadline") {
            valueA = new Date(a.deadline);
            valueB = new Date(b.deadline);
        } else if (sortBy === "status") {
            valueA = (a.status === "not-done" ? 0 : 1) + new Date(a.deadline).getTime();
            valueB = (b.status === "not-done" ? 0 : 1) + new Date(b.deadline).getTime();
        } else if (sortBy === "time") {
            valueA = parseInt(a.time);
            valueB = parseInt(b.time);
        }

        return order === "asc" ? valueA - valueB : valueB - valueA;
    });

    renderTodos();
};

const filterTodos = () => {
    let filteredTodos = [...todoList];

    const selectedStatus = filterStatus.value;
    if (selectedStatus !== "all") {
        filteredTodos = filteredTodos.filter(todo => todo.status === selectedStatus);
    }

    const selectedCategories = Array.from(categoryCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    if (selectedCategories.length > 0) {
        filteredTodos = filteredTodos.filter(todo => selectedCategories.includes(todo.category));
    }

    renderTodos(filteredTodos);
};

selectAllCategories.addEventListener("change", () => {
    categoryCheckboxes.forEach(checkbox => checkbox.checked = selectAllCategories.checked);
});

categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        selectAllCategories.checked = categoryCheckboxes.length === 
        document.querySelectorAll("input[name='filter-category']:checked").length;
    });
});

const renderTodos = (filteredTodos = todoList) => {
    listContainer.innerHTML = "";

    filteredTodos.forEach((todo, index) => {
        const today = new Date().toISOString().split("T")[0];
        const isPast = todo.deadline < today;

        if (isPast) todo.status = "done";

        const listItem = document.createElement("li");
        listItem.className = `todo-item ${todo.status === "done" ? "completed" : ""}`;

        listItem.innerHTML = `
            <input type="checkbox" class="check-task" onchange="toggleComplete(${index})"
                ${todo.status === "done" ? "checked disabled" : ""}>
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

const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("currentUser");
        window.location.href = "/pages/login.html";
    });
}

todoForm.addEventListener("submit", addTodo);
sortButton.addEventListener("click", sortTodos);
filterButton.addEventListener("click", filterTodos);

renderTodos();
