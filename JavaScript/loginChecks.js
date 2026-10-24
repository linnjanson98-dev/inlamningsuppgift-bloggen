let username;
const namn = "Kalle";

const authButton = document.getElementById("authButton");

function checkIfLoggedIn() {
    username = localStorage.getItem("username")
    if (username === namn) {
        return true;
    }
    else {
        return false;
    }

} 

function updateButton() {
    if (checkIfLoggedIn()) {
        authButton.textContent = "Logga ut"
    }
}

if (authButton) {
    authButton.addEventListener("click", () => {
        if (checkIfLoggedIn()) {

            localStorage.removeItem("username");
            window.location.reload();
        }
        else {
            window.location = "inloggning.html";
        }
    })
}

function notLoggedIn(alertMsg) {
    window.alert(`Du måste logga in för att ${alertMsg}`);
}

