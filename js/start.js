const currentUser = sessionStorage.getItem("currentUser");

if (!currentUser) {
    window.location.href = "../login.html"; 
}

const displayWelcomeMessage = () => {
    const welcomeContainer = document.getElementById("welcomeContainer");
    welcomeContainer.innerHTML = currentUser
        ? `Welcome, ${currentUser}!`
        : "No user logged in!";
};

displayWelcomeMessage();

const quote = document.querySelector("#quote");
const author = document.querySelector("#author");

const getQuote = async () => {
    try {
        const response = await fetch("https://dummyjson.com/quotes/random");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        quote.textContent = `"${data.quote}"`;
        author.textContent = `- ${data.author}`;
    } catch (error) {
        console.error("Error fetching quote:", error);
        quote.textContent = "Could not retrieve quote.";
        author.textContent = "";
    }
};

getQuote();

const display3Todos = () => {
    const todoList = document.querySelector("#todoList");
    if (!todoList) return console.error("Error: #todoList element not found!");

    const todos = JSON.parse(localStorage.getItem(`${currentUser}_todos`)) || [];

    if (todos.length === 0) {
        todoList.innerHTML = "<li>No pending tasks found.</li>";
        return;
    }

    const unfinishedTodos = todos
        .filter(todo => todo.status !== "done")
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 3);

    todoList.innerHTML = unfinishedTodos.length
        ? unfinishedTodos.map(todo => `
            <li class="card">
                <p><b>Task:</b> ${todo.title}</p>
                <p><b>Deadline:</b> ${todo.deadline}</p>
                <p><b>Category:</b> ${todo.category}</p>
            </li>
        `).join("")
        : "<li>No unfinished tasks.</li>";
};

const displayTop3Habits = () => {
    const habitList = document.querySelector("#habitList");
    if (!habitList) return console.error("Error: #habitList element not found!");

    const habits = JSON.parse(localStorage.getItem(`${currentUser}_habits`)) || [];

    habitList.innerHTML = habits.length
        ? habits.sort((a, b) => b.repetitioner - a.repetitioner)
            .slice(0, 3)
            .map(habit => `
                <li class="card">
                    <p><b>Routine:</b> ${habit.rutin}</p>
                    <p><b>Repetitions:</b> ${habit.repetitioner}</p>
                </li>
            `).join("")
        : "<li>No habits saved.</li>";
};

const displayNext3Events = () => {
    const eventList = document.querySelector("#eventList");
    if (!eventList) return console.error("Error: #eventList element not found!");

    const events = JSON.parse(localStorage.getItem(`${currentUser}_events`)) || [];

    eventList.innerHTML = events.length
        ? events.filter(event => new Date(event.startTime) > new Date())
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            .slice(0, 3)
            .map(event => `
                <li class="card">
                    <p><b>Event:</b> ${event.name}</p>
                    <p><b>Start:</b> ${event.startTime.replace("T", " ")}</p>
                    <p><b>End:</b> ${event.endTime.replace("T", " ")}</p>
                </li>
            `).join("")
        : "<li>No upcoming events found.</li>";
};

document.querySelector("#logoutButton").addEventListener("click", () => {
    sessionStorage.removeItem("currentUser");
    alert("✅ You have been logged out.");
    window.location.href = "../login.html";  
});

display3Todos();
displayTop3Habits();
displayNext3Events();
