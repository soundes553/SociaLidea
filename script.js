/* =========================================================
   0. INITIALISATION
========================================================= */
let currentPage = 1;
let lastPage = 1;
let isLoadingPosts = false;
let scrollTicking = false;

setupUI();
getPosts();


/* =========================================================
   1. SCROLL INFINI
========================================================= */
window.addEventListener("scroll", () => {

    if (scrollTicking) {
        return; // on ignore les événements de scroll tant qu'une frame n'a pas été traitée
    }
    scrollTicking = true;

    requestAnimationFrame(() => {

        const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 200;

        if (endOfPage && currentPage < lastPage && !isLoadingPosts) {
            currentPage = currentPage + 1;
            getPosts(false, currentPage);
        }

        scrollTicking = false;
    });
});


/* =========================================================
   2. AFFICHAGE DES POSTS
========================================================= */
function getPosts(reload = true, page = 1) {

    if (isLoadingPosts) {
        return; // une requête est déjà en cours, on ignore
    }
    isLoadingPosts = true;

    if (reload) {
        showSkeletons(3);
    }

    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=20&page=${page}`)
        .then((response) => {

            lastPage = response.data.meta.last_page;

            let posts = response.data.data;

            if (reload) {
                document.getElementById("posts").innerHTML = "";
            }

            let postsHTML = "";
            posts.forEach((post, index) => {
                postsHTML += buildPostCard(post, index);
            });
            document.getElementById("posts").insertAdjacentHTML("beforeend", postsHTML);

        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            isLoadingPosts = false;
        });
}

// Affiche des cartes "squelette" animées pendant le chargement
function showSkeletons(count) {
    let html = "";
    for (let i = 0; i < count; i++) {
        html += `
            <div class="skeleton-card">
                <div class="skeleton-line w-40" style="height:20px;"></div>
                <div class="skeleton-block"></div>
                <div class="skeleton-line w-90"></div>
                <div class="skeleton-line w-60"></div>
            </div>
        `;
    }
    document.getElementById("posts").innerHTML = html;
}

// Construit le HTML d'une carte de post
function buildPostCard(post, index = 0) {

    let tagsContent = "";
    if (post.tags != null) {
        post.tags.forEach((tag) => {
            tagsContent += `<span class="tags">${tag.name}</span>`;
        });
    }

    let postTitle = post.title == null ? " " : post.title;
    let animationDelay = (index % 8) * 70; // apparition en cascade

    return `
        <div class="card post-card mb-3" data-id="${post.id}" style="animation-delay:${animationDelay}ms">

            <!-- USERNAME EN HAUT DU POST -->
            <div class="card-header" style="background-color: #a5a4e4;">
                <img
                    src="${post.author.profile_image}"
                    class="rounded-circle border border-1"
                    style="width:25px; height:25px"
                >
                <b style="color:var(--color)">${post.author.username}</b>
            </div>

            <div class="card-body" style="background-color: var(--background-color-blanc);">

                <img src="${post.image}" class="w-100">

                <h6 class="post-timestamp mt-2">${post.created_at}</h6>

                <h5 style="color:var(--color)">${postTitle}</h5>

                <p style="color:var(--color)">${post.body}</p>

                <hr>

                <!-- ZONE CLIQUABLE : ouvre / ferme les commentaires -->
                <div class="post-comments-toggle" style="cursor:pointer;" onclick="togglePostComments(${post.id}, this)">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-pen"
                        viewBox="0 0 16 16"
                    >
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                    </svg>
                    <span style="color:var(--color)">(${post.comments_count}) Comments</span>
                </div>

                <div style="display: inline; color:var(--color)">
                    ${tagsContent}
                </div>

                <!-- SECTION COMMENTAIRES : cachée par défaut (CSS), s'ouvre au clic -->
                <div class="comments-section" id="comments-${post.id}"></div>

            </div>

        </div>
    `;
}


/* =========================================================
   3. AFFICHAGE / MASQUAGE DES COMMENTAIRES D'UN POST
========================================================= */
function togglePostComments(postId, clickedElement) {

    let commentsContainer = document.getElementById(`comments-${postId}`);

    // si déjà ouvert => on referme (animation CSS via retrait de la classe)
    if (commentsContainer.classList.contains("open")) {
        commentsContainer.classList.remove("open");
        return;
    }

    // sinon on ouvre, en chargeant les commentaires si pas déjà fait
    commentsContainer.classList.add("open");

    if (commentsContainer.dataset.loaded === "true") {
        return; // déjà chargés, pas besoin de refaire l'appel API
    }

    loadPostComments(postId, commentsContainer);
}

function loadPostComments(postId, container) {

    // Posts statiques de démo (HTML) : commentaires fictifs, pas d'appel API
    if (postId === "test-1" || postId === "test-2") {
        let fakeComments = [
            { author: { username: "sinda", profile_image: "photo/2.jpg" }, body: "Great post!" },
            { author: { username: "soundes0", profile_image: "photo/2.jpg" }, body: "I totally agree." },
            { author: { username: "chineS", profile_image: "photo/2.jpg" }, body: "Thanks for sharing." }
        ];
        renderComments(fakeComments, container, postId);
        container.dataset.loaded = "true";
        return;
    }

    container.innerHTML = `<p class="text-center" style="color:var(--color)">Loading comments...</p>`;

    axios.get(`https://tarmeezacademy.com/api/v1/posts/${postId}`)
        .then((response) => {

            let comments = response.data.data.comments;
            renderComments(comments, container, postId);
            container.dataset.loaded = "true";

        })
        .catch((error) => {
            if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Data:", error.response.data);
            } else {
                console.log("Error:", error.message);
            }
            container.innerHTML = `<p class="text-danger">Unable to load comments.</p>`;
        });
}

function renderComments(comments, container, postId) {

    let html = `<hr><h6 style="color:var(--color)">Comments</h6>`;

    if (!comments || comments.length === 0) {
        html += `<p class="text-muted" id="no-comments-${postId}">No comments yet.</p>`;
    } else {
        comments.forEach((comment) => {
            html += commentItemHTML(comment);
        });
    }

    html += commentFormHTML(postId);

    container.innerHTML = html;
}

// HTML d'un commentaire (réutilisé pour l'affichage initial ET l'ajout instantané)
function commentItemHTML(comment) {
    return `
        <div class="comment-item d-flex align-items-start mb-2">
            <img
                src="${comment.author.profile_image}"
                class="rounded-circle border me-2"
                style="width:25px; height:25px"
            >
            <div class="ms-2">
                <b style="color:var(--color)">${comment.author.username}</b>
                <p class="mb-0" style="color:var(--color)">${comment.body}</p>
            </div>
        </div>
    `;
}

// Formulaire d'ajout de commentaire (caché en display:none !important si pas connecté)
function commentFormHTML(postId) {

    let token = localStorage.getItem("token");
    let hiddenClass = token ? "" : "d-none-important";

    return `
        <div class="comment-form d-flex align-items-center mt-3 ${hiddenClass}">
            <input
                type="text"
                class="form-control comment-input"
                id="comment-input-${postId}"
                placeholder="Write a comment..."
                onkeydown="if(event.key==='Enter'){ sendComment(${JSON.stringify(postId)}) }"
            >
            <button type="button" class="btn-send-comment" onclick='sendComment(${JSON.stringify(postId)})'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                </svg>
            </button>
        </div>
    `;
}


/* =========================================================
   3.1 ENVOI D'UN NOUVEAU COMMENTAIRE
========================================================= */
function sendComment(postId) {

    let input = document.getElementById(`comment-input-${postId}`);
    let text = input.value.trim();

    if (!text) {
        return;
    }

    let user = JSON.parse(localStorage.getItem("user"));

    // Posts statiques de démo : pas d'appel API, ajout local uniquement
    if (postId === "test-1" || postId === "test-2") {
        appendNewComment(postId, { author: user, body: text });
        input.value = "";
        return;
    }

    let token = localStorage.getItem("token");

    let formData = new FormData();
    formData.append("body", text);

    axios.post(`https://tarmeezacademy.com/api/v1/posts/${postId}/comments`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    })
    .then(() => {
        appendNewComment(postId, { author: user, body: text });
        input.value = "";
    })
    .catch((error) => {
        console.log(error);
        let msg = (error.response && error.response.data && error.response.data.message)
            ? error.response.data.message
            : "Unable to send comment.";
        showAlert("Success-Alert", msg, "danger");
    });
}

// Ajoute le nouveau commentaire à l'écran juste avant le formulaire, sans tout recharger
function appendNewComment(postId, comment) {

    let container = document.getElementById(`comments-${postId}`);

    let noCommentsMsg = document.getElementById(`no-comments-${postId}`);
    if (noCommentsMsg) {
        noCommentsMsg.remove();
    }

    let wrapper = document.createElement("div");
    wrapper.innerHTML = commentItemHTML(comment);

    let form = container.querySelector(".comment-form");
    container.insertBefore(wrapper.firstElementChild, form);

    container.classList.add("open"); // garde la section ouverte/étendue
}


/* =========================================================
   4. ALERTES
========================================================= */
function showAlert(idPlaceHolder, msg, type) {

    const alertPlaceholder = document.getElementById(idPlaceHolder);

    if (!alertPlaceholder) {
        console.error("L'élément", idPlaceHolder, "n'existe pas.");
        return;
    }

    const wrapper = document.createElement("div");

    wrapper.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show custom-alert-in" role="alert" style="position: fixed; top:150px; right: 20px; z-index:99999999;">
            ${msg}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    alertPlaceholder.appendChild(wrapper);

    setTimeout(() => {
        wrapper.remove();
    }, 3000);
}


/* =========================================================
   5. GESTION DE L'INTERFACE SELON L'ÉTAT DE CONNEXION
========================================================= */
function setupUI() {

    let token = localStorage.getItem("token");
    let user = JSON.parse(localStorage.getItem("user"));

    let logindiv = document.getElementById("logindiv");
    let logoutdiv = document.getElementById("logoutdiv");
    let btnAddPostDiv = document.getElementById("btnAddPostDiv");

    if (token == null) {
        // Utilisateur non connecté
        logindiv.style.setProperty("display", "flex", "important");
        logoutdiv.style.setProperty("display", "none", "important");
        btnAddPostDiv.style.setProperty("display", "none", "important");

    } else {
        // Utilisateur connecté
        document.getElementById("profile-div").innerHTML = `
            <img id="profile-id" src="${user.profile_image}" alt="" class="rounded-circle border border-1" style="width:35px; height:35px">
            <b id="user-name-id" style="font-size: 20px;">${user.username}</b>
        `;

        logindiv.style.setProperty("display", "none", "important");
        logoutdiv.style.setProperty("display", "flex", "important");
        btnAddPostDiv.style.setProperty("display", "flex", "important");
    }
}

function logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showAlert("Success-Alert", "Logout successfully!", "success");
    setupUI();
}


/* =========================================================
   6. CONNEXION (LOGIN)
========================================================= */
function loginBtnClicked() {

    let username = document.getElementById("username-id").value;
    let password = document.getElementById("password-text").value;

    axios.post("https://tarmeezacademy.com/api/v1/login", {
        username: username,
        password: password
    })
    .then((response) => {

        let token = response.data.token;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const modal = document.getElementById("loginModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        showAlert("Success-Alert", "Login Successfully!", "success");
        setupUI();
    })
    .catch((error) => {

        let msg = error.response.data.message;
        showAlert("Success-Alert", msg, "danger");

        document.getElementById("username-id").value = "";
        document.getElementById("password-text").value = "";
    });
}


/* =========================================================
   7. INSCRIPTION (REGISTER)
========================================================= */
function RegisterBtnClicked() {

    let username = document.getElementById("register-username-id").value;
    let name = document.getElementById("register-name-id").value;
    let password = document.getElementById("register-password-text").value;
    let image = document.getElementById("register-img").files[0];

    let formData = new FormData();
    formData.append("username", username);
    formData.append("name", name);
    formData.append("password", password);
    formData.append("image", image);

    axios.post("https://tarmeezacademy.com/api/v1/register", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    .then((response) => {

        let token = response.data.token;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const modal = document.getElementById("RegisterModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        showAlert("Success-Alert", "New User Registered Successfully!", "success");
        setupUI();
    })
    .catch((error) => {

        let msg = error.response.data.message;
        showAlert("Success-Alert", msg, "danger");

        document.getElementById("register-name-id").value = "";
        document.getElementById("register-username-id").value = "";
        document.getElementById("register-password-text").value = "";
    });
}


/* =========================================================
   8. CRÉATION D'UN NOUVEAU POST
========================================================= */
function CreateNewPostClicked() {

    let title = document.getElementById("create-post-title-input").value;
    let body = document.getElementById("create-post-body-input").value;
    let image = document.getElementById("create-post-img-input").files[0];
    let token = localStorage.getItem("token");

    let formData = new FormData();
    formData.append("body", body);
    formData.append("title", title);
    formData.append("image", image);

    axios.post("https://tarmeezacademy.com/api/v1/posts", formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    })
    .then((response) => {

        const modal = document.getElementById("create-post-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        showAlert("Success-Alert", "New Post Has Been Created!", "success");
        getPosts();
    })
    .catch((error) => {

        let msg = error.response.data.message;
        showAlert("Success-Alert", msg, "danger");
    });
}