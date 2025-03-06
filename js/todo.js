const todoForm = document.getElementById("todo-form");
const listContainer = document.getElementById("listContainer");
const addTodoButton = document.getElementById("add-todo");

const successModal = document.getElementById("successModal");
const deleteModal = document.getElementById("deleteModal");
const emptyInputsModal = document.getElementById("emptyInputsModal");

const okButton = document.getElementById("okButton");
const okButtonEmpty = document.getElementById("okButtonEmpty");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

const sortSelect = document.getElementById("sort-todo");
const sortButton = document.getElementById("sort-button");
const filterButton = document.getElementById("filter-todos");
const filterStatus = document.getElementById("filter-todo-status");
const categoryCheckboxes = document.querySelectorAll("input[name='filter-category']");
const selectAllCategories = document.getElementById("select-all-categories");

let currentUser = sessionStorage.getItem("currentUser");

if (!currentUser) {
    currentUser = localStorage.getItem("lastUser");
    if (!currentUser) {
        window.location.href = "./login.html";
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

function openModal(modal) {
    modal.style.display = "flex";
}

function closeModal(modal) {
    modal.style.display = "none";
}

okButton.addEventListener("click", () => closeModal(successModal));
okButtonEmpty.addEventListener("click", () => closeModal(emptyInputsModal));
cancelDeleteBtn.addEventListener("click", () => closeModal(deleteModal));

todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("todo-title").value.trim();
    const description = document.getElementById("todo-description").value.trim();
    const time = document.getElementById("todo-time").value;
    const category = document.getElementById("todo-category").value;
    const deadline = document.getElementById("todo-deadline").value;
    const today = new Date().toISOString().split("T")[0];

    if (!title || !description || !time || !category || !deadline) {
        openModal(emptyInputsModal);
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
    
    document.getElementById("modalMessage").textContent = "Task successfully added!";
    openModal(successModal);
});

window.removeTodo = (index) => {
    confirmDeleteBtn.setAttribute("data-index", index);
    openModal(deleteModal);
};

confirmDeleteBtn.addEventListener("click", () => {
    const index = parseInt(confirmDeleteBtn.getAttribute("data-index"));
    if (!isNaN(index)) {
        todoList.splice(index, 1);
        saveTodosToStorage();
        renderTodos();
    }
    closeModal(deleteModal);
});

window.editTodo = (index) => {
    const todoToEdit = todoList[index];

    document.getElementById("todo-title").value = todoToEdit.title;
    document.getElementById("todo-description").value = todoToEdit.description;
    document.getElementById("todo-time").value = todoToEdit.time;
    document.getElementById("todo-category").value = todoToEdit.category;
    document.getElementById("todo-deadline").value = todoToEdit.deadline;

    editIndex = index; 
    addTodoButton.textContent = "Update Task"; 
};

filterButton.addEventListener("click", () => {
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
});

selectAllCategories.addEventListener("change", () => {
    categoryCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCategories.checked;
    });
});

window.toggleComplete = (index) => {
    const todo = todoList[index];
    const today = new Date().toISOString().split("T")[0];

    if (todo.deadline < today && todo.status === "done") {
        alert("⚠️ You cannot uncheck a past completed task.");
        renderTodos();
        return;
    }

    if (todo.deadline > today && todo.status === "not-done") {
        alert("⚠️ This task is scheduled for the future.");
        renderTodos();
        return;
    }

    todoList[index].status = todoList[index].status === "done" ? "not-done" : "done";
    saveTodosToStorage();
    renderTodos();
};

sortButton.addEventListener("click", () => {
    const sortBy = sortSelect.value;
    const order = document.querySelector("input[name='sort-order']:checked")?.value || "asc";

    if (sortBy === "time") {
        todoList.sort((a, b) => order === "asc" ? parseInt(a.time) - parseInt(b.time)
         : parseInt(b.time) - parseInt(a.time));
    } else if (sortBy === "deadline") {
        todoList.sort((a, b) => order === "asc" ? new Date(a.deadline) - new Date(b.deadline) 
        : new Date(b.deadline) - new Date(a.deadline));
    } else if (sortBy === "status") {
        let notDoneTodos = todoList.filter(todo => todo.status === "not-done");
        let doneTodos = todoList.filter(todo => todo.status === "done");

        notDoneTodos.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        doneTodos.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        if (order === "asc") {
            todoList = [...notDoneTodos, ...doneTodos];
        } else {
            todoList = [...doneTodos.reverse(), ...notDoneTodos.reverse()];
        }
    }

    renderTodos(todoList);
});


function renderTodos(todos = todoList) {
    listContainer.innerHTML = "";

    todos.forEach((todo, index) => {
        const isCompleted = todo.status === "done";
        const textDecoration = isCompleted ? "line-through" : "none";

        const listItem = document.createElement("li");
        listItem.className = `todo-item ${isCompleted ? "completed" : ""}`;
        listItem.innerHTML = `
            <input type="checkbox" class="check-task" onchange="toggleComplete(${index})"
                ${isCompleted ? "checked" : ""}>
            <span class="todo-text" style="text-decoration: ${textDecoration};">
                <b>${todo.title}</b> - ${todo.description} (${todo.category}) [${todo.time}] 
                - ${todo.deadline}
            </span>
            <button class="editBtn" onclick="editTodo(${index})">
                <i class="fas fa-pen-to-square"></i>
            </button>
            <button class="deleteBtn" onclick="removeTodo(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        listContainer.appendChild(listItem);
    });
}

const logoutButton = document.getElementById("logoutButton"); 

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("currentUser");
        localStorage.removeItem("lastUser");
        window.location.href = "./login.html"; 
    });
}

renderTodos();
