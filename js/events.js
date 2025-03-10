const fieldset = document.querySelector('fieldset')
const eventNameInput = document.querySelector('#eventName')
const startTimeInput = document.querySelector('#startTime')
const endTimeInput = document.querySelector('#endTime')
const addBtn = document.querySelector('#addBtn')
const eventList = document.querySelector('#eventList')
const upcomingBtn = document.querySelector('#upcoming')
const previousBtn = document.querySelector('#previous')
const allBtn = document.querySelector('#all')
const h2Text = document.querySelector('h2')


//hämta inloggad användare, om ingen inloggad, gå till login.
const currentUser = sessionStorage.getItem('currentUser')
if (!currentUser) {
  window.location.href = './pages/login.html'
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

//modals ist för alerts
// Alert-modal
function showModalAlert(message) {
  const modal = document.querySelector('#alertModal')
  const msg = document.querySelector('#alertMessage')
  msg.innerText = message
  modal.style.display = 'block'
}

document.querySelector('#alertClose').addEventListener('click', () => {
  document.querySelector('#alertModal').style.display = 'none'
})

// Confirm modal
function showModalConfirm(message, onConfirm, onCancel) {
  const modal = document.querySelector('#confirmModal')
  const msg = document.querySelector('#confirmMessage')
  msg.innerText = message
  modal.style.display = 'block'

  const btnOk = document.querySelector('#confirmOk')
  const btnCancel = document.querySelector('#confirmCancel')

  function cleanup() {
    modal.style.display = 'none'
    btnOk.removeEventListener('click', okHandler)
    btnCancel.removeEventListener('click', cancelHandler)
  }

  function okHandler() {
    cleanup()
    if (typeof onConfirm === 'function') onConfirm()
  }

  function cancelHandler() {
    cleanup()
    if (typeof onCancel === 'function') onCancel()
  }

  btnOk.addEventListener('click', okHandler)
  btnCancel.addEventListener('click', cancelHandler)
}


function createNewEvent() {
  //hämta inputs
  const eventName = eventNameInput.value.trim()
  const startTime = startTimeInput.value
  const endTime = endTimeInput.value

  //om inputs inte är ifyllda, visa alert.
  if (!eventName || !startTime || !endTime) {
    showModalAlert('Please ensure all fields are filled in.')
    return
  }

  //checka så startdatum är innan slutdatum
  if (new Date(endTime) < new Date(startTime)) {
    showModalAlert('The end date must be after the start date.')
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
  showModalAlert('Event saved!')
}

//funktion för att rensa inputfält
function clearInputs() {
  eventNameInput.value = ''
  startTimeInput.value = ''
  endTimeInput.value = ''

  fieldset.classList.remove('editing')
}

// gör hela inputfältet klickbart för både start&slut-tid
startTimeInput.addEventListener('click', function () {
  this.focus()
  if (this.showPicker) {
    this.showPicker()
  }
})

endTimeInput.addEventListener('click', function () {
  this.focus()
  if (this.showPicker) {
    this.showPicker()
  }
})

//funktion för att visa events
function displayEvents(eventsToDisplay) {
  // Töm listan innan den uppdateras
  eventList.innerHTML = ''

  // Om inga event finns, visa meddelande
  if (events.length === 0) {
    eventList.innerHTML = "<p>No events found.</p>"
    return
  }

  eventsToDisplay.forEach((event) => {
    const li = document.createElement('li')

    const eventText = document.createElement('span')
    eventText.className = 'eventText'
    eventText.innerText = `${event.name} | Start: ${event.startTime.replace('T', ' ')} | End: ${event.endTime.replace('T', ' ')}`

    const editBtn = document.createElement('button')
    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>'
    const deleteBtn = document.createElement('button')
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'

    //om datum & tid redan passerat, lägg på klass.
    if (new Date(event.endTime) < new Date()) {
      li.classList.add('pastEvents')
    }

    //radera
    deleteBtn.addEventListener('click', () => {
      showModalConfirm('Are you sure you want to delete this event?', () => {
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
      },
        () => {
          // Cancel - inget sker
        }
      )
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
        eventNameInput.value = event.name
        startTimeInput.value = event.startTime
        endTimeInput.value = event.endTime
        //spara indexet på det event som ska redigeras
        editIndex = originalIndex
        addBtn.innerText = 'Update Event'
        fieldset.classList.add('editing')
      }
    })

    li.append(eventText, editBtn, deleteBtn)
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

if (document.querySelector('#logoutButton')) {
  document.querySelector('#logoutButton').addEventListener('click', (event) => {
    event.preventDefault()
    sessionStorage.removeItem('currentUser')
    window.location.href = 'login.html'
  })
}
