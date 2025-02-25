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
    alert("⚠️ Please fill in all fields.");
    return;
  }

  if (endTime < startTime) {
    alert("⚠️ The end date must be after the start date.");
    return;
  }

  const newEvent = { name: eventName, startTime, endTime };
  events.push(newEvent);
  events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  saveEventsToStorage(events);
  filterEvents("upcoming");
  clearInputs();
  alert("✅ Event saved!");
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
    li.innerText = `${event.name} | Start: ${event.startTime.replace("T", " ")} | End: ${event.endTime.replace("T", " ")}`;

    const editBtn = document.createElement("span");
    editBtn.innerText = "✏️";
    const deleteBtn = document.createElement("span");
    deleteBtn.innerText = "🗑️";

    if (new Date(event.endTime) < now) {
      li.classList.add("pastEvents");
    }

    deleteBtn.addEventListener("click", () => {
      events.splice(index, 1);
      saveEventsToStorage(events);
      displayEvents(events);
    });

    editBtn.addEventListener("click", () => {
      document.querySelector("#eventName").value = event.name;
      document.querySelector("#startTime").value = event.startTime;
      document.querySelector("#endTime").value = event.endTime;

      editIndex = index;
      addBtn.innerText = "Update event";
    });

    eventList.append(li);
    li.append(deleteBtn, editBtn);
  });
}

function filterEvents(type) {
  if (type === "upcoming") {
    filteredEvents = events.filter(event => new Date(event.startTime) > now);
    h2Text.innerText = "Upcoming Events";
  } else if (type === "previous") {
    filteredEvents = events.filter(event => new Date(event.endTime) < now);
    h2Text.innerText = "Previous Events";
  } else {
    filteredEvents = events;
    h2Text.innerText = "All Events";
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

document.querySelector("#addBtn").addEventListener("click", () => {
  if (editIndex !== -1) {
    const eventName = document.querySelector("#eventName").value.trim();
    const startTime = document.querySelector("#startTime").value;
    const endTime = document.querySelector("#endTime").value;

    events.splice(editIndex, 1, { name: eventName, startTime, endTime });
    saveEventsToStorage(events);
    displayEvents(filteredEvents);

    editIndex = -1;
    addBtn.innerText = "Add event";
    clearInputs();
  } else {
    createNewEvent();
  }
});
