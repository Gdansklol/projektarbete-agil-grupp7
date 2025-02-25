
const addBtn = document.querySelector('#addBtn')
const eventList = document.querySelector('#eventList')
const upcomingBtn = document.querySelector('#upcoming')
const previousBtn = document.querySelector('#previous')
const allBtn = document.querySelector('#all')
const h2Text = document.querySelector('h2')

// Hämta inloggad användare
const currentUser = sessionStorage.getItem('currentUser')

//om ingen inloggad, gå till login
if (!currentUser) {
  window.location.href = "/pages/login.html"
}

// Ladda events för aktuell användare
function getEventsFromStorage() {
  const eventsData = localStorage.getItem(`${currentUser}_events`)
  return eventsData ? JSON.parse(eventsData) : []
}

// Spara events till localStorage för aktuell användare
function saveEventsToStorage(events) {
  localStorage.setItem(`${currentUser}_events`, JSON.stringify(events))
}

let events = getEventsFromStorage()


// Hämta events från localStorage eller skapa en tom array om inget finns sparat
// let events = JSON.parse(localStorage.getItem('events')) || []


//variabel för dagens datum & tid
const now = new Date()

let filteredEvents = []

//index för vilket event som redigeras
let editIndex = -1

//visa uupcoming events vid start
filterEvents('upcoming')

// Funktion för att spara events i localStorage
function saveEventsToLocalStorage() {
  localStorage.setItem('events', JSON.stringify(events))
}


// Funktion för att skapa och lägga till event
function createNewEvent() {

  // Hämta värden från inputs
  const eventName = document.querySelector('#eventName').value
  const startTime = document.querySelector('#startTime').value
  const endTime = document.querySelector('#endTime').value

  // Om alla inputs är ifyllda
  if (eventName && startTime && endTime) {

    // Skapa ett objekt till listan 'events'
    const newEvent = {
      name: eventName,
      startTime: startTime,
      endTime: endTime
    }

    //checka så startdatum är innan slutdatum
    if (endTime < startTime) {
      alert('The end date must be after the start date.')
      return
    }

    // Lägg till i array
    events.push(newEvent)

    //jämför starttider och få fram det närmst kommande eventet.
    function sortByStartTime(a, b) {
      return new Date(a.startTime) - new Date(b.startTime)
    }

    //sortera events-listan baserat på ovanstående funktion
    events.sort(sortByStartTime)

    // Spara efter tillägg
    saveEventsToStorage(events)

    // Uppdatera array med nya events
    filterEvents(events)

    //renssa inputfält
    clearInputs()
    //återställ text på knapp
    addBtn.innerText = 'Add event'

    alert('event saved!')

  } else {
    //om inputs inte är ifyllda, visa alert.
    alert('Please ensure all fields are filled in.')

  }

}

//funktion för att tömma inputfält
function clearInputs() {
  document.querySelector('#eventName').value = ''
  document.querySelector('#startTime').value = ''
  document.querySelector('#endTime').value = ''
}

// Funktion för att visa events i listan
function displayEvents(events) {

  // Töm listan innan den uppdateras
  eventList.innerHTML = ''

  // Loopa igenom alla events och lägg till dem i listan
  events.forEach((event, index) => {
    const li = document.createElement('li')
    //ta bort T
    li.innerText = `${event.name} | Start: ${event.startTime.replace('T', ' ')} | End: ${event.endTime.replace('T', ' ')}`

    const editBtn = document.createElement('span')
    editBtn.innerText = '✏️'
    const deleteBtn = document.createElement('span')
    deleteBtn.innerText = '🗑️'

    //om datum & tid redan passerat, lägg på klass.
    if (new Date(event.endTime) < now) {
      li.classList.add('pastEvents')
    }


    //radera
    deleteBtn.addEventListener('click', () => {
      events.splice(index, 1)
      saveEventsToStorage(events)
      displayEvents(events)
    })


    //redigera
    editBtn.addEventListener('click', () => {

      // Fyll i inputfält med det valda eventet
      document.querySelector('#eventName').value = event.name
      document.querySelector('#startTime').value = event.startTime
      document.querySelector('#endTime').value = event.endTime

      //spara indexet på det event som ska redigeras
      editIndex = index

      displayEvents(filteredEvents)

      addBtn.innerText = 'Update event'
    })

    eventList.append(li)
    li.append(deleteBtn, editBtn)

  })
}

//
addBtn.addEventListener('click', () => {
  // Om vi är i redigeringsläge
  if (editIndex !== -1) {
    // Hämta de nya värdena från inputfälten
    const eventName = document.querySelector('#eventName').value
    const startTime = document.querySelector('#startTime').value
    const endTime = document.querySelector('#endTime').value

    // Ersätt det gamla eventet med det nya via splice
    events.splice(editIndex, 1, {
      name: eventName,
      startTime: startTime,
      endTime: endTime
    })

    // Spara uppdaterade events i localStorage
    saveEventsToStorage(events)

    // Uppdatera visningen
    displayEvents(filteredEvents)

    // Återställ knappen till "Add event"
    addBtn.innerText = 'Add event'

    // Återställ editIndex
    editIndex = -1
    clearInputs()
    return
  } else {
    // Om vi inte är i redigeringsläge, skapa nytt event
    createNewEvent()
  }
})

// Funktion för att filtrera events
function filterEvents(type) {

  if (type === 'upcoming') {
    filteredEvents = events.filter(event => new Date(event.startTime) > now)
    h2Text.innerText = 'Upcoming Events'
  } else if (type === 'previous') {
    filteredEvents = events.filter(event => new Date(event.endTime) < now)
    h2Text.innerText = 'Previous Events'
  } else {
    //visa alla events
    filteredEvents = events
    h2Text.innerText = 'All Events'
  }

  //visa filtrerade events
  displayEvents(filteredEvents)
}

// Filtrera enligt type beroende på vilken knapp som klickas på
upcomingBtn.addEventListener('click', () => filterEvents('upcoming'))
previousBtn.addEventListener('click', () => filterEvents('previous'))
allBtn.addEventListener('click', () => filterEvents('all'))


if (document.getElementById("logoutButton")) {
  document.getElementById("logoutButton").addEventListener("click", (event) => {
    event.preventDefault();
    sessionStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });
}