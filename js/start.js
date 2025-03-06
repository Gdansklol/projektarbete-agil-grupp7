// Visa välkomsttext för inloggad anvädare
const currentUser = sessionStorage.getItem('currentUser');

if (!currentUser) {
  window.location.href = "/pages/login.html";
}

// Välkomstmeddelande
function displayWelcomeMessage() {
  if (currentUser) {
    document.getElementById('welcomeContainer').innerHTML = `Welcome, ${currentUser}!`;
  } else {
    document.getElementById('welcomeContainer').innerHTML = 'No user logged in!';
  }
}

// Random Quote
const quote = document.querySelector('#quote');
const author = document.querySelector('#author');

const url = 'https://dummyjson.com/quotes/random';

//asynkron funktion för att hämta citat
const getQuote = async () => {
  try {
    // Hide the quote initially
    quote.style.display = 'none';
    author.style.display = 'none';

    //anropa API
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    //citat & författare
    quote.textContent = `"${data.quote}"`;
    author.textContent = `- ${data.author}`;

    // Display the quote and author
    quote.style.display = 'block';
    author.style.display = 'block';

    // Confetti
    generateConfetti();

  } catch (error) {
    console.error('Error fetching quote:', error);
    quote.textContent = 'Could not retrieve quote.';
    author.textContent = '';
    quote.style.display = 'block';
    author.style.display = 'none';
  }
}

let confettiTriggered = false;

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
    const confettiPieces = document.querySelectorAll('.confetti-piece');
    confettiPieces.forEach(confetti => confetti.remove());
  }, 5000);
}

function getRandomColor() {
  const colors = ['#ff6347', '#ffa500', '#32cd32', '#1e90ff', '#ff69b4'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Hämta citat vid sidladdning
async function initPage() {
  displayWelcomeMessage();
  await getQuote();
}

document.addEventListener("DOMContentLoaded", initPage);

//3 senaste todos, habits & events.

//lista för events
const eventList = document.querySelector('#eventList')
//lista för habits
const habitList = document.querySelector('#habitList')
//lista för todos
const todoList = document.querySelector("#todoList")

// Events

// Funktion för att hämta och visa de tre nästkommande eventen
function displayNext3Events() {
  // Kollar inloggad anvädare
  if (!currentUser) return;

  // Hämta user-specifika events från localStorage
  const events = JSON.parse(localStorage.getItem(`${currentUser}_events`)) || [];

  // Om inga event finns, visa meddelande
  if (events.length === 0) {
    eventList.innerHTML = "<p>No upcoming events found.</p>"
    return
  }

  // Filtrera ut så vi ser kommande events
  const upcomingEvents = events.filter(event => new Date(event.startTime) > new Date())

  // Om inga kommande event finns, visa meddelande
  if (upcomingEvents.length === 0) {
    eventList.innerHTML = "<p>No upcoming events found.</p>"
    return
  }

  // Sortera eventen efter starttid, från det närmaste till det äldsta
  upcomingEvents.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

  // Ta de tre första kommande eventen
  const nextThreeEvents = upcomingEvents.slice(0, 3)

  // Tom sträng för att skapa innehåll
  let value = ''
  nextThreeEvents.forEach((event) => {
    value += `
      <ul class="card">
        <p>Event: ${event.name.replace('T', ' ')} | Start: ${event.startTime.replace('T', ' ')} | End: ${event.endTime.replace('T', ' ')}</p>
      </ul>
    `
  })

  // Visa innehåll i listan
  eventList.innerHTML = value
}

//Habits 

// Funktion för att hämta och visa de tre mest upprepade vanorna
function displayTop3Habits() {
  // Kollar inloggad anvädare
  if (!currentUser) return;

  // hämta rutiner från localStorage
  const habits = JSON.parse(localStorage.getItem(`${currentUser}_habits`)) || []

  // Om inga rutiner finns, visa meddelande
  if (habits.length === 0) {
    habitList.innerHTML = "<p>No habits saved.</p>"
    return
  }

  // Sortera rutinerna efter antal repetitioner
  habits.sort((a, b) => b.repetitioner - a.repetitioner)

  // Ta de tre rutiner med högst antal repetitioner
  const topThreeHabits = habits.slice(0, 3)

  //tom sträng för att skapa innehåll
  let value = ''
  topThreeHabits.forEach((habit) => {
    value += `
      <ul class="card">
        <p>Routine: ${habit.rutin} | Repetitioner: ${habit.repetitioner}</p>
      </ul>
    `
  })

  //visa innehåll i lidtan
  habitList.innerHTML = value
}


// Todos

// Funktion för att hämta och visa de tre senaste ej utförda ärendena
function display3Todos() {
  // Kollar inloggad anvädare
  if (!currentUser) return;

  // Hämta todos från localStorage
  const todos = JSON.parse(localStorage.getItem(`${currentUser}_todoList`)) || [];

  // Om inga todos finns, visa meddelande
  if (todos.length === 0) {
    todoList.innerHTML = "<p>No pending tasks found.</p>"
    return
  }

  // Filtrera ut todos som inte är klara (status !== "done") eller som har passerat deadline
  const pendingTodos = todos.filter(todo => todo.status !== "done" && new Date(todo.deadline) >= new Date())

  // Om inga todos finns kvar (alla är klara eller förfallna), visa meddelande
  if (pendingTodos.length === 0) {
    todoList.innerHTML = "<p>No pending tasks found.</p>"
    return
  }

  // Sortera todos efter deadline, närmast först
  pendingTodos.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))

  // Ta de tre första (med närmst liggande datum)
  const unfinishedTodos = pendingTodos.slice(0, 3)

  // Bygg upp innehållet att visa
  let value = ""
  unfinishedTodos.forEach(todo => {
    value += `
      <ul class="card">
        <p>Task: ${todo.title} | Deadline: ${todo.deadline} | Category: ${todo.category}</p>
      </ul>
    `
  })

  // Sätt innehåll i listan
  todoList.innerHTML = value
}


// Kör funktionerna när startsidan laddats klart
document.addEventListener("DOMContentLoaded", () => {
  displayNext3Events()
  displayTop3Habits()
  display3Todos()
})

// Logga ut
document.querySelector('#logoutButton').addEventListener('click', () => {
  sessionStorage.removeItem('currentUser');
  
  window.location.href = '/pages/login.html';
});

