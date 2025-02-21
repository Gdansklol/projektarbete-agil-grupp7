const output = document.querySelector(".output");
const proSpan = document.querySelector(".progress span");
const plusButton = document.querySelector(".plus");
const minusButton = document.querySelector(".minus");
const logoutButton = document.getElementById("logoutButton");

let a = 0; 
output.textContent = a;
proSpan.style.height = `${a * 10}%`;

plusButton.addEventListener("click", () => {
    if (a >= 10) {
        window.location.href = "login.html"; 
        return;
    }
    a++;
    updateSpinner();
});

minusButton.addEventListener("click", () => {
    if (a <= 0) return;
    a--;
    updateSpinner();
});

const updateSpinner = () => {
    output.textContent = a;
    proSpan.style.height = `${a * 10}%`;
};

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("currentUser");
        window.location.href = "login.html";
    });
}
