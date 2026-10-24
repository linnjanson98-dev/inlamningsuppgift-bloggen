let inloggning;
let felmeddelande;
const namn = "Kalle";
const lösenord = "qwe123"; 
/*konstanter med de korrekta inloggningsuppifterna, const för att de inte ska
ändras någonstans. */

function init() { //initiera sidan
    /* Hämtar element från min html. Min form med inloggningen, 
    mitt felmeddelande och min andra form som ska visas vid lyckad inloggning.*/
    inloggning = document.querySelector("form");
    felmeddelande = document.getElementById("felmeddelande");

    /* Lägger ett event på "submit" knappen som gör att de olika inloggningsfunktionerna körs*/
    inloggning.addEventListener("submit", event=>{
        event.preventDefault(); //Ser till at JS har kontroll över vad som händer när man klickar på submit och inte html. 
        checkLogin(); 
    });
}

window.onload = init;

//Plockade bort min getFormData och kör en checkLogin() direkt.
function checkLogin(){
    const username = inloggning.elements.username.value;
    const password = inloggning.elements.psw.value;

    /* jämför input med korrekta inloggningsupgifterna och visar felmeddelandet om det inte stämmer
        Stämmer uppgifterna körs loggedIn och användaren sparas i localstorage så de fortsätter vara inloggade även om de 
        laddar om sidan*/
    if (username != namn || password != lösenord){
        felmeddelande.style.display = "block";
    }
    else{
        localStorage.setItem("username", username);
        window.location = "index.html";
        //loggedIn();
    }
}
/* Plockade bort massa onödig kod som inte behövdes länge, typ funktioner för att visa eller dölja element då det bara används en enda gång
även inloggade versionen av sidan*/