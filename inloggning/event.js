


if (document.getElementById("logoutButton")) {
    document.getElementById("logoutButton").addEventListener("click", (event) => {
      event.preventDefault(); 
      sessionStorage.removeItem("currentUser");
      window.location.href = "login.html"; 
    });
  }
  