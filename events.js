
const addBtn = document.querySelector('#addBtn')
const eventList = document.querySelector('#eventList')

// Array för att lagra events
let events = []

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

    // Lägg till i array
    events.push(newEvent)

    // Uppdatera array med nya events
    displayEvents()

    // Töm inputfält
    document.querySelector('#eventName').value = ''
    document.querySelector('#startTime').value = ''
    document.querySelector('#endTime').value = ''

    addBtn.innerText = 'Add event'

    //om inputs inte är ifyllda, visa alert.
  } else {

    alert('Please ensure all fields are filled in.')

  }
}

// Funktion för att visa events i listan
function displayEvents() {
  // Töm listan innan den uppdateras
  eventList.innerHTML = ''

  // Loopa igenom alla events och lägg till dem i listan
  events.forEach((event, index) => {
    const li = document.createElement('li')
    const editBtn = document.createElement('span')
    editBtn.innerText = '✏️'
    const deleteBtn = document.createElement('span')
    deleteBtn.innerText = '🗑️'

    deleteBtn.addEventListener('click', () => li.remove())

    editBtn.addEventListener('click', () => {
      // Fyll i inputfält med det valda eventet
      document.querySelector('#eventName').value = event.name
      document.querySelector('#startTime').value = event.startTime
      document.querySelector('#endTime').value = event.endTime

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