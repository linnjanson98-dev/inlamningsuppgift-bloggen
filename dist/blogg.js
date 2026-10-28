"use strict";
const namn = "Kalle";
const authButton = document.getElementById("authButton");
const writePostBtn = document.getElementById("writePostBtn");
const loginMessage = document.getElementById("loginMessage");
const presentBlogPosts = document.getElementById("presentBlogPosts");
/* Det blev kaos i min init och jag valde att dela in den i mindre funktioner för att strukturera koden bättre
Det funkade dett viss del, men jag tycker att jag ändå lyckades röra till det längre ner i koden */
function init() {
    initLogin();
    initWritePost();
    initPresentPosts();
    //Ladda in alla existerande blogginlägg
}
/*En funktion för att se om man är inloggad som används på olika ställen i koden, t.ex. updateButton nedanför.
Jag skapade samma funktioner först i Javascript för de andra sidorna men stötte på problemet med att koppla ihop TS och JS
Det blev ett för stort projekt för mig att ta itu med så jag valde att bara återskapa dom i TS*/
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
/* Här körs allt som har med inloggningsknappen och inloggning att göra */
function initLogin() {
    updateButton();
    if (!writePostBtn || !loginMessage)
        return;
    if (checkBlogLogin()) {
        writePostBtn.style.display = "block";
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
                sessionStorage.setItem("previousPage", window.location.href);
                window.location.href = "inloggning.html";
            }
        });
    }
}
/* Här körs allting som har med att skapa inlägg att göra.

Jag hämtar min form från blogg.html och testar så att den har något innehåll, testar även min writePostBtn.
Gör ett click event som döljer nappen efter man klickar p den och istället visar formuläret man skapar inlägget i.
Gör den till flex för att funka med min CSS styling*/
function initWritePost() {
    let formRef = document.querySelector("form");
    if (!writePostBtn || !formRef)
        return;
    writePostBtn.addEventListener("click", () => {
        writePostBtn.style.display = "none";
        formRef.style.display = "flex";
    });
    /* Nytt event på submit som hämtar infon från formRef och sparar i variabler. Behöver specificera vilken sorts HTML Elements för att TS ska hitta
    rätt element och dess value. Kollar så att det finns något innehåll, varnar att det saknas om det inte gör det, och om allt är rätt så används
    klassen BlogPost och dess constructor för att skapa ett nytt objekt, alltså inlägget. Om det finns en array i localstorage så hämtas den annars skapas en tom
    som newPost sparas i och sen sparas den i localstorgae igen med hjälp av stringify. formReset för att tömma formuläret och reload för att dölja det igen
    tills man klickar på Skapa Inlägg igen.
    */
    formRef.addEventListener("submit", (event) => {
        event.preventDefault();
        const title = formRef.querySelector("#title");
        const username = localStorage.getItem("username");
        const content = formRef.querySelector("#content");
        //kollar så att det finns title och content och att de har något innehåll. Valde prepend och inte appendChild för jag ville texten skulle hamna längst upp.
        if (!title?.value || !content?.value) {
            let missingInput = document.getElementById("missingInput");
            if (missingInput) {
                missingInput.style.display = "block";
            }
        }
        else if (!username) {
            return;
        }
        else {
            const newPost = new BlogPost(title.value, username, content.value);
            let blogPostArray = JSON.parse(localStorage.getItem("blogPosts") || "[]");
            blogPostArray.push(newPost);
            localStorage.setItem("blogPosts", JSON.stringify(blogPostArray));
            formRef.reset();
            window.location.reload();
        }
    });
}
/* Här hanteras allting som har med att visa inlägg att göra!
Jag ville att inläggen skulle hamna med nyast längst upp så med
*/
function initPresentPosts() {
    let blogPostArray = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    let reverseBlogPostArray = [...blogPostArray].reverse();
    //... spread operator som gör en kopia av min array och sen vänder jag på den för att få nyast först
    reverseBlogPostArray.forEach(post => {
        const article = document.createElement("article");
        //Vill att inlägget och kommentarerna är i samma article, men vill kontrollera dom separat så delar in dem i containers
        //postContainer och commentContainer längre ner
        let postContainer = document.createElement("div");
        postContainer.classList.add("postContainer");
        let postTitle = createElement("h3", post.title);
        postContainer.appendChild(postTitle);
        let postUsername = createElement("h4", post.username);
        postContainer.appendChild(postUsername);
        let postDate = createElement("h5", post.date);
        postContainer.appendChild(postDate);
        let postContent = createElement("p", post.content);
        postContainer.appendChild(postContent);
        article.appendChild(postContainer);
        if (checkBlogLogin()) {
            article.appendChild(createCommentForm(post, blogPostArray));
        }
        else {
            const cantComment = createElement("p", "Logga in för att lämna en kommenter");
            article.appendChild(cantComment);
        }
        presentComments(post, article);
        presentBlogPosts?.appendChild(article);
    });
}
function createElement(elementType, textContent) {
    const element = document.createElement(elementType);
    element.textContent = textContent;
    return element;
}
function createCommentForm(post, blogPostArray) {
    const commentForm = document.createElement("form");
    commentForm.id = "commentForm";
    let formTitle = createElement("h4", "Lämna en kommentar: ");
    commentForm.appendChild(formTitle);
    let commentInput = document.createElement("textarea");
    commentInput.name = "commentInput";
    commentForm.appendChild(commentInput);
    let submitComment = document.createElement("input");
    submitComment.type = "submit";
    submitComment.value = "Kommentera";
    commentForm.appendChild(submitComment);
    commentForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const username = localStorage.getItem("username");
        if (!username || !commentInput.value) {
            return;
        }
        const newComment = new Comments(username, commentInput.value);
        post.comments.push(newComment);
        localStorage.setItem("blogPosts", JSON.stringify(blogPostArray));
        commentForm.reset();
        window.location.reload();
    });
    return commentForm;
}
function presentComments(post, article) {
    const commentSectionTitle = createElement("h4", "Kommentarer: ");
    article.appendChild(commentSectionTitle);
    /*Jag tycker inläggen blir för stora om många kommenterar så skapar en container att lägga dom i
    Så jag kan bestämma hur mycket som visas i min CSS*/
    const commentContainer = document.createElement("div");
    commentContainer.classList.add("commentContainer");
    //lägger till commentContainer redan här så noComments kan skrivas ut! Hade det i slutet förut och om inga kommentarer fanns
    //så gjorde return att funktionen avslutades innan commentContainer lades till på artikeln. 
    article.appendChild(commentContainer);
    if (!post.comments || post.comments.length === 0) {
        let noComments = createElement("p", "Inga kommentarer ännu...");
        commentContainer.appendChild(noComments);
        return;
    }
    post.comments.forEach(comment => {
        let commentBody = document.createElement("article");
        commentBody.classList.add("commentBody");
        let commentUser = createElement("h4", comment.username);
        commentBody.appendChild(commentUser);
        let commentDate = createElement("h5", comment.date);
        commentBody.appendChild(commentDate);
        let commentContent = createElement("p", comment.content);
        commentBody.appendChild(commentContent);
        commentContainer.prepend(commentBody);
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
init();
