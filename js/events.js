const currentUser = sessionStorage.getItem("currentUser");
if (!currentUser) {
  window.location.href = "../login.html"; 
}

function getEventsFromStorage() {
  return JSON.parse(localStorage.getItem(`${currentUser}_events`)) || [];
}

function saveEventsToStorage(events) {
  localStorage.setItem(`${currentUser}_events`, JSON.stringify(events));
}

let events = getEventsFromStorage();
let filteredEvents = [];
let editIndex = -1;
const now = new Date();

filterEvents("upcoming");

function createNewEvent() {
  const eventName = document.querySelector("#eventName").value.trim();
  const startTime = document.querySelector("#startTime").value;
  const endTime = document.querySelector("#endTime").value;

  if (!eventName || !startTime || !endTime) {
    alert("⚠️ Fyll i alla fält.");
    return;
  }

  if (new Date(endTime) < new Date(startTime)) {
    alert("⚠️ Sluttiden måste vara efter starttiden.");
    return;
  }

  const newEvent = { name: eventName, startTime, endTime };

  if (editIndex !== -1) {
    events[editIndex] = newEvent;
    editIndex = -1;
    document.querySelector("#addBtn").innerText = "Lägg till Event";
  } else {
    events.push(newEvent);
  }

  events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  saveEventsToStorage(events);
  filterEvents("upcoming");
  clearInputs();
}


function clearInputs() {
  document.querySelector("#eventName").value = "";
  document.querySelector("#startTime").value = "";
  document.querySelector("#endTime").value = "";
}

function displayEvents(events) {
  const eventList = document.querySelector("#eventList");
  eventList.innerHTML = "";

  events.forEach((event, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${event.name} | Start: ${event.startTime.replace("T", " ")} | Slut: ${event.endTime.replace("T", " ")}</span>
      <span class="edit-btn"><i class="fas fa-edit"></i></span>
      <span class="delete-btn"><i class="fas fa-trash-alt"></i></span>
    `;

    if (new Date(event.endTime) < now) {
      li.classList.add("pastEvents");
      li.style.textDecoration = "line-through";
      li.style.color = "gray";
    }

    li.querySelector(".delete-btn").addEventListener("click", () => {
      events.splice(index, 1);
      saveEventsToStorage(events);
      displayEvents(events);
    });

    li.querySelector(".edit-btn").addEventListener("click", () => {
      document.querySelector("#eventName").value = event.name;
      document.querySelector("#startTime").value = event.startTime;
      document.querySelector("#endTime").value = event.endTime;
      editIndex = index;
      document.querySelector("#addBtn").innerText = "Uppdatera Event";
    });

    eventList.append(li);
  });
}

function filterEvents(type) {
  const h2Text = document.querySelector("h2");

  if (type === "upcoming") {
    filteredEvents = events.filter(event => new Date(event.startTime) > now);
    h2Text.innerText = "Kommande Event";
  } else if (type === "previous") {
    filteredEvents = events.filter(event => new Date(event.endTime) < now);
    h2Text.innerText = "Tidigare Event";
  } else {
    filteredEvents = events;
    h2Text.innerText = "Alla Event";
  }

  displayEvents(filteredEvents);
}

document.querySelector("#upcoming").addEventListener("click", () => filterEvents("upcoming"));
document.querySelector("#previous").addEventListener("click", () => filterEvents("previous"));
document.querySelector("#all").addEventListener("click", () => filterEvents("all"));

document.querySelector("#logoutButton").addEventListener("click", () => {
  sessionStorage.removeItem("currentUser");
  window.location.href = "../login.html";  
});

document.querySelector("#addBtn").addEventListener("click", createNewEvent);
