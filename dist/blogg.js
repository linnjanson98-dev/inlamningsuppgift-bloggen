"use strict";
const namn = "Kalle";
const authButton = document.getElementById("authButton");
const writePostBtn = document.getElementById("writePostBtn");
const loginMessage = document.getElementById("loginMessage");
const presentBlogPosts = document.getElementById("presentBlogPosts");
function init() {
    //localStorage.removeItem("blogPosts");
    //Kolla om man är inloggad och kan skapa inlägg eller kommentera på inlägg
    initLogin();
    initWritePost();
    initPresentPosts();
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
                sessionStorage.setItem("previousPage", window.location.href);
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
            window.location.reload();
        }
    });
}
function initPresentPosts() {
    //Foreach posts i blogPosts skriv ut massa skit.
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
        commentContainer.appendChild(commentBody);
    });
    article.appendChild(commentContainer);
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
