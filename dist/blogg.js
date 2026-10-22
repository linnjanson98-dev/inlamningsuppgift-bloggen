"use strict";
const namn = "Kalle";
const authButton = document.getElementById("authButton");
const writePostBtn = document.getElementById("writePostBtn");
const loginMessage = document.getElementById("loginMessage");
function init() {
    //Kolla om man är inloggad och kan skapa inlägg eller kommentera på inlägg
    initLogin();
    initWritePost();
    //Ladda in alla existerande blogginlägg
}
function checkBlogLogin() {
    return localStorage.getItem("username") === namn;
}
function updateButton() {
    if (!authButton)
        return;
    if (checkBlogLogin()) {
        authButton.textContent = "Logga ut";
    }
    else {
        authButton.textContent = "Logga in";
    }
}
function initLogin() {
    updateButton();
    if (!writePostBtn || !loginMessage)
        return;
    if (checkBlogLogin()) {
        writePostBtn.style.display = "inline-block";
        loginMessage.style.display = "none";
    }
    else {
        writePostBtn.style.display = "none";
        loginMessage.style.display = "flex";
    }
    if (authButton) {
        authButton.addEventListener("click", () => {
            if (checkBlogLogin()) {
                localStorage.removeItem("username");
                window.location.reload();
            }
            else {
                window.location.href = "inloggning.html";
            }
        });
    }
}
function initWritePost() {
    let formRef = document.querySelector("form");
    if (!writePostBtn || !formRef)
        return;
    writePostBtn.addEventListener("click", () => {
        writePostBtn.style.display = "none";
        formRef.style.display = "flex";
    });
}
class BlogPost {
    title;
    date;
    username;
    content;
    comments = [];
    //date behöver inte vara med som parameter för den skapas direkt i constructorn
    constructor(title, username, content) {
        this.title = title;
        this.date = new Date().toLocaleDateString("sv-SV");
        this.username = username;
        this.content = content;
    }
    addComment(comment) {
        this.comments.push(comment);
    }
    writePost() {
    }
}
class Comments {
    username;
    date;
    content;
    constructor(username, content) {
        this.username = username;
        this.date = new Date().toLocaleDateString("sv-SV");
        this.content = content;
    }
}
const username = localStorage.getItem("username");
if (username) {
    const post = new BlogPost("Mitt första inlägg", username, "Det här är innehållet.");
    const comment = new Comments(username, "Bra inlägg!");
    post.addComment(comment);
    console.log(post);
}
init();
