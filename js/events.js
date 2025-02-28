const addBtn = document.querySelector('#addBtn')
const eventList = document.querySelector('#eventList')
const upcomingBtn = document.querySelector('#upcoming')
const previousBtn = document.querySelector('#previous')
const allBtn = document.querySelector('#all')
const h2Text = document.querySelector('h2')

//hämta inloggad användare, om ingen inloggad, gå till login.
const currentUser = sessionStorage.getItem('currentUser')
if (!currentUser) {
  window.location.href = '/pages/login.html'
}

// Ladda events för aktuell användare
function getEventsFromStorage() {
  return JSON.parse(localStorage.getItem(`${currentUser}_events`)) || []
}

// Spara events till localStorage för aktuell användare
function saveEventsToStorage(events) {
  localStorage.setItem(`${currentUser}_events`, JSON.stringify(events))
}

let events = getEventsFromStorage()
let filteredEvents = []
//index för vilket event som redigeras
let editIndex = -1
//visa upcoming events vid sidladdning
filterEvents('upcoming')

function createNewEvent() {
  //hämta inputs
  const eventName = document.querySelector('#eventName').value.trim()
  const startTime = document.querySelector('#startTime').value
  const endTime = document.querySelector('#endTime').value

  //om inputs inte är ifyllda, visa alert.
  if (!eventName || !startTime || !endTime) {
    alert('⚠️ Please ensure all fields are filled in.')
    return
  }

  //checka så startdatum är innan slutdatum
  if (new Date(endTime) < new Date(startTime)) {
    alert('⚠️ The end date must be after the start date.')
    return
  }

  //Skapa ett objekt till listan 'events'
  const newEvent = { name: eventName, startTime, endTime }

  if (editIndex !== -1) {
    events[editIndex] = newEvent
    editIndex = -1
    addBtn.innerText = 'Add Event'
  } else {
    events.push(newEvent)
  }

  //sortera efter datum
  events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
  //spara till localstorage, visa filtrerade, rensa.
  saveEventsToStorage(events)

  //bestäm vilken lista som ska visas baserat på det nya eventets datum
  const eventStart = new Date(newEvent.startTime)
  const eventEnd = new Date(newEvent.endTime)
  const currentDate = new Date()

  if (eventEnd < currentDate) {
    filterEvents('previous')
  } else if (eventStart > currentDate) {
    filterEvents('upcoming')
  } else {
    filterEvents('all')
  }

  clearInputs()
  alert('Event saved!✅')
}

//funktion för att rensa inputfält
function clearInputs() {
  document.querySelector('#eventName').value = ''
  document.querySelector('#startTime').value = ''
  document.querySelector('#endTime').value = ''
}

//funktion för att visa events
function displayEvents(eventsToDisplay) {
  // Töm listan innan den uppdateras
  eventList.innerHTML = ''

  eventsToDisplay.forEach((event) => {
    const li = document.createElement('li')
    //ta bort T
    li.innerText = `${event.name} | Start: ${event.startTime.replace('T', ' ')} | End: ${event.endTime.replace('T', ' ')}`

    const editBtn = document.createElement('span')
    editBtn.innerText = '✏️'
    const deleteBtn = document.createElement('span')
    deleteBtn.innerText = '🗑️'

    //om datum & tid redan passerat, lägg på klass.
    if (new Date(event.endTime) < new Date()) {
      li.classList.add('pastEvents')
    }

    //radera
    deleteBtn.addEventListener('click', () => {
      if (confirm('⚠️Are you sure you want to delete this event?')) {
        // Hitta eventets ursprungliga index i events med findIndex
        const originalIndex = events.findIndex(e =>
          e.name === event.name &&
          e.startTime === event.startTime &&
          e.endTime === event.endTime
        )
        if (originalIndex !== -1) {
          events.splice(originalIndex, 1)
          saveEventsToStorage(events)
          // Visa rätt filter 
          if (h2Text.innerText === 'Upcoming Events') {
            filterEvents('upcoming')
          } else if (h2Text.innerText === 'Previous Events') {
            filterEvents('previous')
          } else {
            filterEvents('all')
          }
        }
      }
    })

    //redigera
    editBtn.addEventListener('click', () => {
      // Hitta eventets ursprungliga index i events
      const originalIndex = events.findIndex(e =>
        e.name === event.name &&
        e.startTime === event.startTime &&
        e.endTime === event.endTime
      )
      if (originalIndex !== -1) {
        document.querySelector('#eventName').value = event.name
        document.querySelector('#startTime').value = event.startTime
        document.querySelector('#endTime').value = event.endTime
        //spara indexet på det event som ska redigeras
        editIndex = originalIndex
        document.querySelector('#addBtn').innerText = 'Update Event'
      }
    })

    li.append(deleteBtn, editBtn)
    eventList.append(li)
  })
}

addBtn.addEventListener('click', createNewEvent)

function filterEvents(type) {
  //funktion för att filtera events
  if (type === 'upcoming') {
    filteredEvents = events.filter(event => new Date(event.startTime) > new Date())
    h2Text.innerText = 'Upcoming Events'
  } else if (type === 'previous') {
    filteredEvents = events.filter(event => new Date(event.endTime) < new Date())
    h2Text.innerText = 'Previous Events'
  } else {
    filteredEvents = events
    h2Text.innerText = 'All Events'
  }

  displayEvents(filteredEvents)
}

upcomingBtn.addEventListener('click', () => filterEvents('upcoming'))
previousBtn.addEventListener('click', () => filterEvents('previous'))
allBtn.addEventListener('click', () => filterEvents('all'))

if (document.getElementById('logoutButton')) {
  document.getElementById('logoutButton').addEventListener('click', (event) => {
    event.preventDefault()
    sessionStorage.removeItem('currentUser')
    window.location.href = 'login.html'
  })
}
