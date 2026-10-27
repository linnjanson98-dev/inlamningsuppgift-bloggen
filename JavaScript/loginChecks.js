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
            /*Sparar sidan man är på i sessionStorage och använder den på inloggningssidan för att gå tillbaka till där man var istället för index.
            Använde history.back först men då laddades inte sidan om och då presenterades inte sparade svampar och man kunde inte kommentera eller göra inlägg. 
            förens man laddade om sidan själv. */
            sessionStorage.setItem("previousPage", window.location.href); 
            window.location = "inloggning.html";
        }
    })
}

function notLoggedIn(alertMsg) {
    window.alert(`Du måste logga in för att ${alertMsg}`);
}

