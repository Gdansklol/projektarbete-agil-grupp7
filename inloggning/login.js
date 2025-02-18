initializePage();

function initializePage() {
  const signupForm = document.getElementById("signupForm");
  const userSection = document.getElementById("userSection");
  const usernameDisplay = document.getElementById("usernameDisplay");

  const currentUser = sessionStorage.getItem("currentUser");
  if (currentUser) {
    userSection.style.display = "block";
    usernameDisplay.textContent = currentUser;
  } else {
    userSection.style.display = "none";
  }
}

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const signupUsername = document.getElementById("signupUsername").value.trim();
  const signupPassword = document.getElementById("signupPassword").value;

  if (signupUsername === "" || signupPassword === "") {
    alert("Please fill in all fields!");
    return;
  }
  
  sessionStorage.setItem("currentUser", signupUsername);
  
  alert("Registration successful. You can now log in 😊");
  signupForm.reset();
  
  const userSection = document.getElementById("userSection");
  const usernameDisplay = document.getElementById("usernameDisplay");
  userSection.style.display = "block";
  usernameDisplay.textContent = signupUsername;
});
