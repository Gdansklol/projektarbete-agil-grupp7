
//lista för events
const eventList = document.querySelector('#eventList')
//lista för habits
const habitList = document.querySelector('#habitList')
//lista för todos
const todoList = document.querySelector("#todoList")


//Events

// Funktion för att hämta och visa de tre nästkommande eventen
function displayNext3Events() {
  // hämta events localStorage eller tom array om inget finns
  const events = JSON.parse(localStorage.getItem('events')) || []

  // Om inga event finns, visa meddelande
  if (events.length === 0) {
    eventList.innerHTML = "<p>No upcoming events found.</p>"
    return
  }

  // Filtrera ut så vi ser kommande events
  const upcomingEvents = events.filter(event => new Date(event.startTime) > new Date())

  // Sortera eventen efter starttid, från det närmaste till det äldsta
  upcomingEvents.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

  // Ta de tre första kommande eventen
  const nextThreeEvents = upcomingEvents.slice(0, 3)

  //tom sträng för att skapa innehåll
  let value = ''
  nextThreeEvents.forEach((event) => {
    value += `
      <ul class = "card">
        <p>Event: ${event.name.replace('T', ' ')} | Start: ${event.startTime.replace('T', ' ')} | End: ${event.endTime.replace('T', ' ')}</p>
      </ul>
    `
  })

  // visa innehåll i listan
  eventList.innerHTML = value
}



//Habits 

// Funktion för att hämta och visa de tre mest upprepade vanorna
function displayTop3Habits() {
  // hämta rutiner från localStorage
  const habits = JSON.parse(localStorage.getItem('habits')) || []

  // Om inga rutiner finns, visa meddelande
  if (habits.length === 0) {
    habitList.innerHTML = "<p>No habits saved.</p>"
    return
  }

  // Sortera rutinerna efter antal repetitioner
  habits.sort((a, b) => b.repetitioner - a.repetitioner)

  // Ta de tre rutiner med högst antal repetitioner
  const topThreeHabits = habits.slice(0, 3)

  //yom sträng för att skapa innehåll
  let value = ''
  topThreeHabits.forEach((habit) => {
    value += `
      <ul class="card">
        <p>Rutin: ${habit.rutin} | Repetitioner: ${habit.repetitioner}</p>
      </ul>
    `
  })

  //visa innehåll i lidtan
  habitList.innerHTML = value
}




//todos 

// Funktion för att hämta och visa de tre senaste ej utförda ärendena
function display3Todos() {
  // Hämta todos från localStorage
  const todos = JSON.parse(localStorage.getItem("todoList")) || []

  // Om inga todos finns, visa meddelande
  if (todos.length === 0) {
    todoList.innerHTML = "<p>No pending tasks found.</p>"
    return
  }

  // Filtrera ut todos som inte är klara
  const pendingTodos = todos.filter(todo => todo.status !== "done")

  // Sortera todos efter datum, närmast först
  pendingTodos.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))

  // Ta de tre första (med närmst liggande datum)
  const unfinishedTodos = pendingTodos.slice(0, 3)

  let value = ""
  unfinishedTodos.forEach(todo => {
    value += `
      <ul class="card">
        <p>Task: ${todo.title} | Deadline: ${todo.deadline} | Category: ${todo.category}</p>
      </ul>
    `
  })

  //sätt innehåll i listan
  todoList.innerHTML = value
}

// Kör funktionerna när startsidan laddats klart
document.addEventListener("DOMContentLoaded", () => {
  displayNext3Events()
  displayTop3Habits()
  display3Todos()
})