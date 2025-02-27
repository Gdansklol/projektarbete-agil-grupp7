
const addBtn = document.querySelector('#addBtn')
const eventList = document.querySelector('#eventList')
const upcomingBtn = document.querySelector('#upcoming')
const previousBtn = document.querySelector('#previous')
const allBtn = document.querySelector('#all')
const h2Text = document.querySelector('h2')


//hämta inloggad användare, om ingen inloggad, gå till login.
const currentUser = sessionStorage.getItem("currentUser")
if (!currentUser) {
  window.location.href = "/pages/login.html"
}

// Ladda events för aktuell användare
function getEventsFromStorage() {
  return JSON.parse(localStorage.getItem(`${currentUser}_events`)) || []
}

// Spara events till localStorage för aktuell användare
function saveEventsToStorage(events) {
  localStorage.setItem(`${currentUser}_events`, JSON.stringify(events))
}

//hämta från localstorage, filtrerade events
let events = getEventsFromStorage()
let filteredEvents = []
//index för vilket event som redigeras
let editIndex = -1
//hämta dagens datum & tid
const now = new Date()
//visa uupcoming events vid sidladdning
filterEvents("upcoming")

// Funktion för att skapa och lägga till event
function createNewEvent() {
  //hämta inputs
  const eventName = document.querySelector("#eventName").value.trim()
  const startTime = document.querySelector("#startTime").value
  const endTime = document.querySelector("#endTime").value

  //om inputs inte är ifyllda, visa alert.
  if (!eventName || !startTime || !endTime) {
    alert("⚠️ Please ensure all fields are filled in.")
    return
  }

  //checka så startdatum är innan slutdatum
  if (new Date(endTime) < new Date(startTime)) {
    alert("⚠️ The end date must be after the start date.")
    return
  }

  //Skapa ett objekt till listan 'events'
  const newEvent = { name: eventName, startTime, endTime }

  if (editIndex !== -1) {
    events[editIndex] = newEvent
    editIndex = -1
    addBtn.innerText = "Add Event"
  } else {
    events.push(newEvent)
  }

  //sortera efter datum
  events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

  //spara till localstorage, visa filtrerade, rensa.
  saveEventsToStorage(events)
  filterEvents("upcoming")
  clearInputs()
  alert('Event saved!✅')
}

//funktion för att visa eventss
function displayEvents(events) {
  // Töm listan innan den uppdateras
  eventList.innerHTML = ""

  //loopa igenom alla events
  events.forEach((event, index) => {
    const li = document.createElement("li")
    //ta bort T
    li.innerText = `${event.name} | Start: ${event.startTime.replace('T', ' ')} | End: ${event.endTime.replace('T', ' ')}`

    const editBtn = document.createElement("span")
    editBtn.innerText = "✏️"
    const deleteBtn = document.createElement("span")
    deleteBtn.innerText = "🗑️"

    //om datum & tid redan passerat, lägg på klass.
    if (new Date(event.endTime) < now) {
      li.classList.add("pastEvents")
    }

    //funktion för att rensa inputfält
    function clearInputs() {
      document.querySelector("#eventName").value = ""
      document.querySelector("#startTime").value = ""
      document.querySelector("#endTime").value = ""
    }

    //radera
    deleteBtn.addEventListener("click", () => {
      events.splice(index, 1)
      saveEventsToStorage(events)
      displayEvents(events)
    })

    //redigera
    editBtn.addEventListener("click", () => {
      document.querySelector("#eventName").value = event.name
      document.querySelector("#startTime").value = event.startTime
      document.querySelector("#endTime").value = event.endTime
      //spara indexet på det event som ska redigeras
      editIndex = index
      document.querySelector("#addBtn").innerText = "Update Event"
    })

    li.append(deleteBtn, editBtn)
    eventList.append(li)
  })
}

addBtn.addEventListener("click", createNewEvent)

//funktion för att filtera events
function filterEvents(type) {

  if (type === "upcoming") {
    filteredEvents = events.filter(event => new Date(event.startTime) > now)
    h2Text.innerText = "Upcoming Events"
  } else if (type === "previous") {
    filteredEvents = events.filter(event => new Date(event.endTime) < now)
    h2Text.innerText = "Previous Events"
  } else {
    filteredEvents = events
    h2Text.innerText = "All Events"
  }

  displayEvents(filteredEvents)
}

// Filtrera enligt type beroende på vilken knapp som klickas på
upcomingBtn.addEventListener("click", () => filterEvents("upcoming"))
previousBtn.addEventListener("click", () => filterEvents("previous"))
allBtn.addEventListener("click", () => filterEvents("all"))


if (document.getElementById("logoutButton")) {
  document.getElementById("logoutButton").addEventListener("click", (event) => {
    event.preventDefault();
    sessionStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });
}
