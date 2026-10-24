"use strict";
const namn = "Kalle";
const authButton = document.getElementById("authButton");
const writePostBtn = document.getElementById("writePostBtn");
const loginMessage = document.getElementById("loginMessage");
function init() {
    //localStorage.removeItem("blogPosts");
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
    formRef.addEventListener("submit", (event) => {
        event.preventDefault();
        const title = formRef.querySelector("#title");
        const username = localStorage.getItem("username");
        const content = formRef.querySelector("#content");
        //kollar så att det finns title och content och att de har något innehåll. Valde prepend och inte appendChild för jag ville texten skulle hamna längst upp.
        if (!title?.value || !content?.value) {
            const postError = document.createElement("p");
            postError.textContent = "Saknas titel och/eller text.";
            formRef.prepend(postError);
        }
        else if (!username) {
            const postError = document.createElement("p");
            postError.textContent = "Gick inte hämta användare. Försök ladda om sidan.";
            formRef.prepend(postError);
        }
        else {
            const newPost = new BlogPost(title.value, username, content.value);
            let blogPostArray = JSON.parse(localStorage.getItem("blogPosts") || "[]");
            blogPostArray.push(newPost);
            localStorage.setItem("blogPosts", JSON.stringify(blogPostArray));
            formRef.reset();
            writePostBtn.style.display = "inline-block";
            formRef.style.display = "none";
        }
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
    publishBlogPost() {
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
/*const username = localStorage.getItem("username");

if (username) {
    const post = new BlogPost(
        "Mitt första inlägg",
        username,
        "Det här är innehållet."
    );
    const comment = new Comments(username, "Bra inlägg!");
    post.addComment(comment);

    console.log(post);
}*/
init();
