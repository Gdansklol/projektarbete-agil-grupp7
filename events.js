
const addBtn = document.querySelector('#addBtn')
const eventList = document.querySelector('#eventList')
const upcomingBtn = document.querySelector('#upcoming')
const previousBtn = document.querySelector('#previous')
const allBtn = document.querySelector('#all')

// Array för att lagra events
let events = []

//variabel för dagens datum & tid
const now = new Date()

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

    // Uppdatera array med nya events
    displayEvents(events)

    //renssa inputfält
    clearInputs()
    //återställ text på knapp
    addBtn.innerText = 'Add event'

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
function displayEvents(eventsToDisplay) {

  // Töm listan innan den uppdateras
  eventList.innerHTML = ''

  // Loopa igenom alla events och lägg till dem i listan
  eventsToDisplay.forEach((event, index) => {
    const li = document.createElement('li')
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
      li.remove()
    })


    //redigera
    editBtn.addEventListener('click', () => {

      // Fyll i inputfält med det valda eventet
      document.querySelector('#eventName').value = event.name
      document.querySelector('#startTime').value = event.startTime
      document.querySelector('#endTime').value = event.endTime

      //
      events.splice(index, 1)
      addBtn.innerText = 'Update event'
    })

    //ta bort T
    li.innerText = `${event.name} | Start: ${event.startTime.replace('T', ' ')} | End: ${event.endTime.replace('T', ' ')}`

    eventList.append(li)
    li.append(deleteBtn, editBtn)

  })
}

// Lägg till event vid click på 'add event'
addBtn.addEventListener('click', createNewEvent)


// Funktion för att filtrera events
function filterEvents(type) {

  let filteredEvents
  if (type === 'upcoming') {
    filteredEvents = events.filter(event => new Date(event.startTime) > now)
  } else if (type === 'previous') {
    filteredEvents = events.filter(event => new Date(event.endTime) < now)
  } else {
    //visa alla events
    filteredEvents = events
  }

  //visa filtrerade events
  displayEvents(filteredEvents)
}

// Filtrera enligt type beroende på vilken knapp som klickas på
upcomingBtn.addEventListener('click', () => filterEvents('upcoming'))
previousBtn.addEventListener('click', () => filterEvents('previous'))
allBtn.addEventListener('click', () => filterEvents('all'))