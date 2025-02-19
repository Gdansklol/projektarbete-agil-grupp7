const output = document.querySelector(".output");
const proSpan = document.querySelector(".progress span");
const plusButton = document.querySelector(".plus");
const minusButton = document.querySelector(".minus");

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

function updateSpinner() {
    output.textContent = a;
    proSpan.style.height = `${a * 10}%`;
}
