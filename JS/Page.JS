const resultsDiv = document.getElementById("results");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const choixType = document.getElementById("choixType");
const choixTri = document.getElementById("choixTri");

// Fonction de recherche
function searchBooks(query) {
    let typeFilter = choixType.value;
    if (typeFilter === "mangas") query = "manga " + query;
    else if (typeFilter === "books" && query.trim() === "") query = "book";

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;

    resultsDiv.textContent = "Chargement...";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            resultsDiv.textContent = "";

            let tri = choixTri.value;
            if (tri === "title") {
                data.docs.sort((a, b) => a.title.localeCompare(b.title));
            } else if (tri === "year") {
                data.docs.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
            }

            data.docs.slice(0, 12).forEach(book => {
                const bookDiv = document.createElement("div");
                bookDiv.classList.add("movie-card");

                if (book.cover_i) {
                    const img = document.createElement("img");
                    img.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
                    img.classList.add("movie-poster");
                    bookDiv.appendChild(img);
                }

                const title = document.createElement("h3");
                title.textContent = book.title;
                bookDiv.appendChild(title);

                const author = document.createElement("p");
                author.textContent = book.author_name ? book.author_name.join(", ") : "Auteur inconnu";
                bookDiv.appendChild(author);

                const year = document.createElement("p");
                year.textContent = book.first_publish_year || "Année inconnue";
                bookDiv.appendChild(year);

                resultsDiv.appendChild(bookDiv);
            });
        })
        .catch(error => {
            resultsDiv.textContent = "Impossible de charger les livres.";
            console.error(error);
        });
}

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query || choixType.value !== "all") searchBooks(query);
});

// Afficher quelques mangas par défaut
searchBooks("Manga");

/* ------------------------------
    POPUP D'INSCRIPTION
------------------------------ */

const popup = document.getElementById("popupInscription");
const joinBtn = document.querySelector(".join-btn");
const closeBtn = document.querySelector(".close");
const formInscription = document.getElementById("formInscription");

joinBtn.addEventListener("click", () => {
    popup.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.style.display = "none";
    }
});

formInscription.addEventListener("submit", (e) => {
    e.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nom || !prenom || !email) {
        alert("Merci de remplir tous les champs.");
        return;
    }

    alert(`Merci ${prenom}, votre inscription a bien été envoyée !`);
    popup.style.display = "none";

    formInscription.reset();
});
