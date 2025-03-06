const currentUser = sessionStorage.getItem('currentUser');

function generateConfetti() {
  if (confettiTriggered) return;

  confettiTriggered = true;
  const confettiWrapper = document.querySelector('.confetti-wrapper');

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti-piece');
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.setProperty('--fall-duration', `${Math.random() * 3 + 3}s`);
    confetti.style.setProperty('--confetti-color', getRandomColor());
    confettiWrapper.appendChild(confetti);
  }

  setTimeout(() => {
    document.querySelectorAll('.confetti-piece').forEach(confetti => confetti.remove());
  }, 5000);
}

function getRandomColor() {
  const colors = ['#ff6347', '#ffa500', '#32cd32', '#1e90ff', '#ff69b4'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function displayWelcomeMessage() {
  const welcomeContainer = document.getElementById('welcomeContainer');
  welcomeContainer.innerHTML = currentUser
    ? `Welcome, ${currentUser}!`
    : 'No user logged in!';
}

const quote = document.querySelector('#quote');
const author = document.querySelector('#author');
const url = 'https://dummyjson.com/quotes/random';

const getQuote = async () => {
  try {
    quote.textContent = 'Loading quote...';
    author.textContent = '';
    quote.style.display = 'block';
    author.style.display = 'none';

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    quote.textContent = `"${data.quote}"`;
    author.textContent = `- ${data.author}`;
    author.style.display = 'block';

    generateConfetti();
  } catch (error) {
    console.error('Error fetching quote:', error);
    quote.textContent = 'Could not retrieve quote.';
    author.textContent = '';
  }
};

const eventList = document.querySelector('#eventList');
function displayNext3Events() {
  if (!currentUser) return;
  const events = JSON.parse(localStorage.getItem(`${currentUser}_events`)) || [];

  if (events.length === 0) {
    eventList.innerHTML = "<p>No upcoming events found.</p>";
    return;
  }

  const upcomingEvents = events.filter(event => new Date(event.startTime) > new Date());
  if (upcomingEvents.length === 0) {
    eventList.innerHTML = "<p>No upcoming events found.</p>";
    return;
  }

  upcomingEvents.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const nextThreeEvents = upcomingEvents.slice(0, 3);

  eventList.innerHTML = nextThreeEvents.map(event => `
    <ul class="card">
      <p>Event: ${event.name} | Start: ${event.startTime} | End: ${event.endTime}</p>
    </ul>
  `).join('');
}

const habitList = document.querySelector('#habitList');
function displayTop3Habits() {
  if (!currentUser) return;
  const habits = JSON.parse(localStorage.getItem(`${currentUser}_habits`)) || [];

  if (habits.length === 0) {
    habitList.innerHTML = "<p>No habits saved.</p>";
    return;
  }

  habits.sort((a, b) => b.repetitioner - a.repetitioner);
  const topThreeHabits = habits.slice(0, 3);

  habitList.innerHTML = topThreeHabits.map(habit => `
    <ul class="card">
      <p>Routine: ${habit.rutin} | Repetitions: ${habit.repetitioner}</p>
    </ul>
  `).join('');
}

const todoList = document.querySelector("#todoList");
function display3Todos() {
  if (!currentUser) return;
  const todos = JSON.parse(localStorage.getItem(`${currentUser}_todoList`)) || [];

  if (todos.length === 0) {
    todoList.innerHTML = "<p>No pending tasks found.</p>";
    return;
  }

  const pendingTodos = todos.filter(todo => todo.status !== "done" && new Date(todo.deadline) >= new Date());
  if (pendingTodos.length === 0) {
    todoList.innerHTML = "<p>No pending tasks found.</p>";
    return;
  }

  pendingTodos.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  const unfinishedTodos = pendingTodos.slice(0, 3);

  todoList.innerHTML = unfinishedTodos.map(todo => `
    <ul class="card">
      <p>Task: ${todo.title} | Deadline: ${todo.deadline} | Category: ${todo.category}</p>
    </ul>
  `).join('');
}

async function initPage() {
  displayWelcomeMessage();

  await Promise.all([
    getQuote(),
    displayNext3Events(),
    displayTop3Habits(),
    display3Todos()
  ]);
}

document.addEventListener("DOMContentLoaded", initPage);


document.querySelector('#logoutButton').addEventListener('click', () => {
  sessionStorage.removeItem('currentUser');
  window.location.href = '/pages/login.html';
});
