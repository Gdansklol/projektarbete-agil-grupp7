initializePage();

const currentUser = sessionStorage.getItem("currentUser");
if (currentUser) {
    window.location.href = "/pages/start.html";
}

function initializePage() {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const showSignupLink = document.getElementById("showSignupForm");
    const showLoginLink = document.getElementById("showLoginForm");
    const loginFormContainer = document.getElementById("loginFormContainer");
    const signupFormContainer = document.getElementById("signupFormContainer");

    showSignupLink.addEventListener("click", (event) => {
        event.preventDefault();
        loginFormContainer.style.display = "none";
        signupFormContainer.style.display = "block";
    });

    showLoginLink.addEventListener("click", (event) => {
        event.preventDefault();
        signupFormContainer.style.display = "none";
        loginFormContainer.style.display = "block";
    });

    signupForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const signupUsername = document.getElementById("signupUsername").value.trim();
        const signupPassword = document.getElementById("signupPassword").value;

        if (!signupUsername || !signupPassword) {
            alert("⚠️ Please fill in all fields!");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        const existingUser = users.find(user => user.username === signupUsername);

        if (existingUser) {
            alert("⚠️ User already exists.");
        } else {
            users.push({ username: signupUsername, password: signupPassword });
            localStorage.setItem("users", JSON.stringify(users));
            alert("✅ Registration successful. You can now log in!");

            signupForm.reset();
            signupFormContainer.style.display = "none";
            loginFormContainer.style.display = "block";
        }
    });

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const loginUsername = document.getElementById("loginUsername").value.trim();
        const loginPassword = document.getElementById("password").value;

        if (!loginUsername || !loginPassword) {
            alert("⚠️ Please fill in all fields!");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.username === loginUsername);

        if (user && user.password === loginPassword) {
            sessionStorage.setItem("currentUser", loginUsername);
            alert("✅ Login successful!");

            window.location.href = "/pages/start.html";
        } else {
            alert("Invalid username or password!");
        }
    });
}
