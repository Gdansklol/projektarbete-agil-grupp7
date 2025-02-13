
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
  events.forEach(event => {
    const li = document.createElement('li')
    //ta bort T
    li.innerText = `${event.name} | Start: ${event.startTime.replace('T', ' ')} | End: ${event.endTime.replace('T', ' ')}`
    eventList.append(li)
  });
}

// Lägg till event vid click på 'add event'
addBtn.addEventListener('click', createNewEvent)